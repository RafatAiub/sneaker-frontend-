export function DashboardHeader({
  activeReservationCount,
  socketConnected,
  usernameInput,
  setUsernameInput,
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Real-time limited drop dashboard</p>
        <h1>Limited Edition Sneaker Drop</h1>
        <p className="subtitle">
          Live stock updates, 60-second reservations, and the latest successful purchasers on every card.
        </p>
      </div>

      <div className="header-panel">
        <label className="field-label" htmlFor="username">
          Shopper username
        </label>
        <input
          id="username"
          className="username-input"
          value={usernameInput}
          onChange={(event) => setUsernameInput(event.target.value)}
          placeholder="Enter your username"
          maxLength={50}
        />
        <div className="meta-row">
          <span className={`status-pill ${socketConnected ? 'online' : 'offline'}`}>
            {socketConnected ? 'Live socket connected' : 'Socket reconnecting'}
          </span>
          <span className="status-pill neutral">Active reservations: {activeReservationCount}</span>
        </div>
      </div>
    </header>
  );
}
