export function NotificationToast({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <div className={`toast ${notification.tone}`} key={notification.id}>
      {notification.message}
    </div>
  );
}
