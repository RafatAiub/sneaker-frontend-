import { formatCurrency, formatRelativeSeconds } from '../lib/dropUtils';

export function DropCard({
  countdownTick,
  drop,
  purchaseDrop,
  reservation,
  reserveDrop,
  submittingState,
}) {
  const reservationActive = Boolean(reservation) && new Date(reservation.expiresAt).getTime() > countdownTick;
  const reserveBusy = submittingState === 'reserve';
  const purchaseBusy = submittingState === 'purchase';
  const stockTone = drop.availableStock === 0 ? 'critical' : drop.availableStock <= 3 ? 'warning' : 'healthy';

  return (
    <article className="drop-card">
      <div className="drop-card-top">
        <div>
          <p className="drop-label">Drop #{drop.id}</p>
          <h2>{drop.name}</h2>
        </div>
        <div className={`stock-badge ${stockTone}`}>
          {drop.availableStock} / {drop.totalStock} left
        </div>
      </div>

      <div className="price-row">
        <span className="price">{formatCurrency(drop.price)}</span>
        <span className="timestamp">Starts {new Date(drop.startsAt).toLocaleString()}</span>
      </div>

      <div className="activity-panel">
        <p className="panel-title">Latest purchasers</p>
        {drop.latestPurchasers.length === 0 ? (
          <p className="muted-copy">No successful purchases yet.</p>
        ) : (
          <ul className="purchaser-list">
            {drop.latestPurchasers.map((purchase) => (
              <li key={purchase.purchaseId}>
                <span>{purchase.username}</span>
                <time>{new Date(purchase.purchasedAt).toLocaleTimeString()}</time>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="reservation-panel">
        <div>
          <p className="panel-title">Your reservation</p>
          <p className="muted-copy">
            {reservationActive
              ? `Reserved as ${reservation.username}. Expires in ${formatRelativeSeconds(reservation.expiresAt)}.`
              : 'Reserve one unit to hold checkout for 60 seconds.'}
          </p>
        </div>

        <div className="action-row">
          <button
            className="primary-button"
            onClick={() => reserveDrop(drop.id)}
            disabled={reserveBusy || purchaseBusy || reservationActive || drop.availableStock === 0}
          >
            {reserveBusy ? 'Reserving...' : reservationActive ? 'Reserved' : 'Reserve'}
          </button>
          <button
            className="secondary-button"
            onClick={() => purchaseDrop(drop.id)}
            disabled={purchaseBusy || reserveBusy || !reservationActive}
          >
            {purchaseBusy ? 'Completing...' : 'Complete purchase'}
          </button>
        </div>
      </div>
    </article>
  );
}
