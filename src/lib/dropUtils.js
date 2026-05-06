import { io } from 'socket.io-client';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://sneaker-drop-backend-db.vercel.app').replace(/\/$/, '');

export const dropSocket = io(API_BASE_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

export function sortDrops(dropList) {
  return [...dropList].sort((leftDrop, rightDrop) => {
    const leftTime = new Date(leftDrop.startsAt).getTime();
    const rightTime = new Date(rightDrop.startsAt).getTime();
    return leftTime - rightTime || leftDrop.id - rightDrop.id;
  });
}

export function mergeDrop(currentDrops, incomingDrop) {
  const nextDrops = [...currentDrops];
  const existingIndex = nextDrops.findIndex((drop) => drop.id === incomingDrop.id);

  if (existingIndex === -1) {
    nextDrops.push(incomingDrop);
  } else {
    nextDrops[existingIndex] = incomingDrop;
  }

  return sortDrops(nextDrops);
}

export function formatCurrency(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatRelativeSeconds(expiresAt) {
  const secondsLeft = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
