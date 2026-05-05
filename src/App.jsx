import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the backend Socket.io server
const socket = io('http://localhost:3000');

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from the backend
    fetch('/items')
      .then(res => res.json())
      .then(data => setItems(data));

    // Listen for real-time stock updates from the backend
    socket.on('itemReserved', (data) => {
      // Handle item reservation update (e.g., update stock or show notification)
      alert(`Item ${data.itemId} reserved by user ${data.userId}`);
      // Optionally, refresh the items state to reflect stock updates
      fetch('/items')
        .then(res => res.json())
        .then(data => setItems(data));
    });

    socket.on('stockRestored', (data) => {
      // Handle stock restoration (reservation expiration)
      alert(`Stock for item ${data.itemId} has been restored.`);
      fetch('/items')
        .then(res => res.json())
        .then(data => setItems(data));
    });

    return () => {
      socket.off('itemReserved');
      socket.off('stockRestored');
    };
  }, []);

  return (
    <div>
      <h1>Sneaker Drop</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price} - Stock: {item.stock}
            {/* Add reserve button */}
            <button onClick={() => reserveItem(item.id)}>Reserve</button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Function to call the backend to reserve an item
  function reserveItem(itemId) {
    const userId = 'user123'; // Example user ID
    fetch('/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, userId }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error reserving item:', error));
  }
}

export default App;