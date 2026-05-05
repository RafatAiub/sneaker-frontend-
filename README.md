# Sneaker Drop Frontend

React + Vite dashboard for the limited-edition sneaker drop system.

## Run locally

1. Start the backend first in `C:\Users\azmai\OneDrive\Desktop\live codeing\techzu-task\sneaker-drop`
   - `npx prisma migrate deploy`
   - `npx prisma generate`
   - `node server.js`
2. Start the frontend in this project
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5173`

## Environment

- Optional: create a `.env` file with `VITE_API_BASE_URL=http://localhost:3000`
- If not provided, the app already falls back to `http://localhost:3000`

## What the UI does

- Loads active drops from `GET /api/drops`
- Subscribes to `drops:snapshot`, `drop:created`, and `drop:update`
- Lets a shopper reserve stock for 60 seconds
- Lets a shopper complete purchase only from an active reservation
- Shows the latest 3 successful purchasers on each drop card

## Demo steps

1. Open two browser windows to `http://localhost:5173`
2. Enter a different username in each window
3. Create a drop from the backend API or Postman
4. Reserve an item in window 1 and watch stock update instantly in window 2
5. Complete the purchase in window 1 and confirm the purchaser feed updates in both windows
6. Reserve again in window 2, do not purchase, and wait 60 seconds
7. Confirm stock is automatically restored in both windows after expiration

## Useful API payload

Create a drop:

```json
{
  "name": "Air Jordan 1",
  "price": 250,
  "totalStock": 100,
  "startsAt": "2026-05-06T12:00:00.000Z"
}
```
