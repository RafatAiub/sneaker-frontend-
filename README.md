# 👟 Sneaker Drop Frontend

A premium, real-time dashboard for limited-edition sneaker drops. Built with **React 19**, **Vite**, and **Socket.IO-client** to provide a seamless and high-pressure shopping experience.

---

##  Live Deployment

- **Live Site:** [https://sneaker-frontend-lilac.vercel.app/](https://sneaker-frontend-lilac.vercel.app/)
- **Backend API:** [https://sneaker-drop-backend-db.vercel.app](https://sneaker-drop-backend-db.vercel.app)

---

##  Features

- **Live Inventory Sync:** Real-time stock updates via WebSockets — no refresh needed.
- **Reservation System:** Secure a pair for 60 seconds. Visual countdowns ensure you know exactly how much time is left.
- **Live Activity Feed:** See who else is scoring pairs with the real-time latest purchasers list on every card.
- **Responsive Design:** Optimized for high-speed interactions on both desktop and mobile.

---

##  Tech Stack

- **Frontend:** React 19, Vite, Vanilla CSS
- **Real-time:** Socket.IO-client
- **State Management:** React Hooks (useState, useEffect, useMemo)
- **Deployment:** Vercel

---

##  Local Development

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   (Optional) Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

##  Demo Scenario

1. Open the **[Live Site](https://sneaker-frontend-lilac.vercel.app/)** in two different browser windows side-by-side.
2. Enter different usernames in each window (e.g., `user_alpha` and `user_beta`).
3. Click **Reserve** in the first window. Observe the stock level decrementing instantly in the second window.
4. Complete the **Purchase** in the first window. Watch the "Latest Purchasers" feed update in real-time across both screens.
5. In the second window, click **Reserve** and let the 60-second timer expire. Observe the stock being automatically restored.

---

##  Project Structure

```text
sneaker-frontend/
├── src/
│   ├── components/     # Reusable UI elements
│   ├── pages/          # Main dashboard views
│   ├── socket/         # Socket.IO configuration
│   └── App.jsx         # Main application logic
└── public/             # Static assets
```

---

##  License
MIT
