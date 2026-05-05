import './App.css';
import { DashboardHeader } from './components/DashboardHeader';
import { DropCard } from './components/DropCard';
import { EmptyState } from './components/EmptyState';
import { NotificationToast } from './components/NotificationToast';
import { useDropDashboard } from './hooks/useDropDashboard';

function App() {
  const {
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
  } = useDropDashboard();

  return (
    <div className="app-shell">
      <DashboardHeader
        activeReservationCount={activeReservationCount}
        socketConnected={socketConnected}
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
      />

      <NotificationToast notification={notification} />

      <main>
        {loadingDrops ? <EmptyState>Loading active drops...</EmptyState> : null}

        {!loadingDrops && drops.length === 0 ? (
          <EmptyState>No active merch drops yet. Create one from the backend and it will appear live here.</EmptyState>
        ) : null}

        <section className="drop-grid">
          {drops.map((drop) => (
            <DropCard
              key={drop.id}
              countdownTick={countdownTick}
              drop={drop}
              purchaseDrop={purchaseDrop}
              reservation={reservations[drop.id]}
              reserveDrop={reserveDrop}
              submittingState={submittingByDrop[drop.id]}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
