import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, dropSocket, mergeDrop, sortDrops } from '../lib/dropUtils';

export function useDropDashboard() {
  const [usernameInput, setUsernameInput] = useState(() => localStorage.getItem('sneaker-username') || '');
  const [drops, setDrops] = useState([]);
  const [reservations, setReservations] = useState({});
  const [loadingDrops, setLoadingDrops] = useState(true);
  const [submittingByDrop, setSubmittingByDrop] = useState({});
  const [notification, setNotification] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [countdownTick, setCountdownTick] = useState(Date.now());

  const normalizedUsername = usernameInput.trim();

  useEffect(() => {
    localStorage.setItem('sneaker-username', usernameInput);
  }, [usernameInput]);

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setCountdownTick(Date.now());
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDrops() {
      try {
        setLoadingDrops(true);
        const response = await fetch(`${API_BASE_URL}/api/drops`);

        if (!response.ok) {
          throw new Error('Unable to load drops.');
        }

        const payload = await response.json();
        if (isMounted) {
          setDrops(sortDrops(payload));
        }
      } catch (error) {
        if (isMounted) {
          showNotification(error.message || 'Unable to load drops right now.', 'error');
        }
      } finally {
        if (isMounted) {
          setLoadingDrops(false);
        }
      }
    }

    loadDrops();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleConnect() {
      setSocketConnected(true);
    }

    function handleDisconnect() {
      setSocketConnected(false);
    }

    function handleSnapshot(snapshotDrops) {
      setDrops(sortDrops(snapshotDrops));
    }

    function handleCreated(createdDrop) {
      setDrops((currentDrops) => mergeDrop(currentDrops, createdDrop));
      showNotification(`New drop is live: ${createdDrop.name}`, 'info');
    }

    function handleReservationCleanup(dropId, reservationId) {
      setReservations((currentReservations) => {
        const nextReservations = { ...currentReservations };
        const currentReservation = nextReservations[dropId];

        if (currentReservation?.id === reservationId) {
          delete nextReservations[dropId];
        }

        return nextReservations;
      });
    }

    function handleUpdate(event) {
      if (!event?.drop) {
        return;
      }

      setDrops((currentDrops) => mergeDrop(currentDrops, event.drop));

      if (event.type === 'reservation.expired' && event.reservationId) {
        handleReservationCleanup(event.drop.id, event.reservationId);
      }

      if (event.type === 'purchase.completed' && event.reservationId) {
        handleReservationCleanup(event.drop.id, event.reservationId);
      }
    }

    dropSocket.connect();
    dropSocket.on('connect', handleConnect);
    dropSocket.on('disconnect', handleDisconnect);
    dropSocket.on('drops:snapshot', handleSnapshot);
    dropSocket.on('drop:created', handleCreated);
    dropSocket.on('drop:update', handleUpdate);

    return () => {
      dropSocket.off('connect', handleConnect);
      dropSocket.off('disconnect', handleDisconnect);
      dropSocket.off('drops:snapshot', handleSnapshot);
      dropSocket.off('drop:created', handleCreated);
      dropSocket.off('drop:update', handleUpdate);
      dropSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setNotification(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [notification]);

  const activeReservationCount = useMemo(
    () => Object.values(reservations).filter((reservation) => new Date(reservation.expiresAt).getTime() > countdownTick).length,
    [reservations, countdownTick],
  );

  function showNotification(message, tone = 'info') {
    setNotification({ message, tone, id: Date.now() });
  }

  function validateUsername() {
    if (!normalizedUsername) {
      showNotification('Enter a username before reserving or purchasing.', 'error');
      return false;
    }

    return true;
  }

  async function reserveDrop(dropId) {
    if (!validateUsername()) {
      return;
    }

    setSubmittingByDrop((currentState) => ({
      ...currentState,
      [dropId]: 'reserve',
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dropId,
          username: normalizedUsername,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Reservation failed.');
      }

      setReservations((currentReservations) => ({
        ...currentReservations,
        [dropId]: payload,
      }));

      showNotification(`Reserved for ${normalizedUsername}. Checkout timer started.`, 'success');
    } catch (error) {
      showNotification(error.message || 'Reservation failed.', 'error');
    } finally {
      setSubmittingByDrop((currentState) => ({
        ...currentState,
        [dropId]: null,
      }));
    }
  }

  async function purchaseDrop(dropId) {
    if (!validateUsername()) {
      return;
    }

    const reservation = reservations[dropId];
    if (!reservation || new Date(reservation.expiresAt).getTime() <= countdownTick) {
      showNotification('You need an active reservation before purchasing.', 'error');
      return;
    }

    setSubmittingByDrop((currentState) => ({
      ...currentState,
      [dropId]: 'purchase',
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          username: normalizedUsername,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Purchase failed.');
      }

      setReservations((currentReservations) => {
        const nextReservations = { ...currentReservations };
        delete nextReservations[dropId];
        return nextReservations;
      });

      showNotification(`Purchase completed for ${normalizedUsername}.`, 'success');
    } catch (error) {
      showNotification(error.message || 'Purchase failed.', 'error');
    } finally {
      setSubmittingByDrop((currentState) => ({
        ...currentState,
        [dropId]: null,
      }));
    }
  }

  return {
    activeReservationCount,
    countdownTick,
    drops,
    loadingDrops,
    notification,
    reserveDrop,
    reservations,
    purchaseDrop,
    setUsernameInput,
    socketConnected,
    submittingByDrop,
    usernameInput,
  };
}
