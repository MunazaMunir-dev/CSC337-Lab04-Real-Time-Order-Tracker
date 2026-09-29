# CSC337 Lab Assignment 04 — Real-Time Order Tracker & Live Support System

A full-stack demonstration of REST, WebSockets/Socket.IO, JSON-RPC 2.0 and Server-Sent Events (SSE).

## Requirements covered
1. REST resource management: `/api/v1/orders` and `/api/v1/catalog`
2. WebSockets (Socket.IO): real-time order status updates and 1-to-1 support room
3. JSON-RPC 2.0: `POST /rpc` with `cancelOrder`
4. SSE: `GET /events` for live order alerts
5. Deployment-ready backend/frontend configuration
6. Clean GitHub repo + README

## Run locally

### Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

For deployment, set frontend environment variable:
```text
VITE_API_URL=https://YOUR-BACKEND-URL
```

## API examples

### Get orders
```http
GET /api/v1/orders
```

### Update status
```http
PATCH /api/v1/orders/ORD-1001/status
Content-Type: application/json

{"status":"Shipped"}
```

### JSON-RPC cancelOrder
```http
POST /rpc
Content-Type: application/json

{
  "jsonrpc":"2.0",
  "method":"cancelOrder",
  "params":{"orderId":"ORD-1001"},
  "id":1
}
```

### SSE
Open:
```text
GET /events
```

## Deployment

### Backend on Render/Railway
- Create a Node service using the `backend` folder.
- Build command: `npm install`
- Start command: `npm start`
- Port: use the platform-provided `PORT` (already supported in code).
- Enable CORS as needed.

### Frontend on Vercel/Netlify
- Project directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=<deployed backend URL>`

## Demo checklist
- Open frontend and confirm `Live` status.
- Show REST orders/catalog in the UI.
- Open two browser tabs and use the support room to demonstrate WebSocket messages.
- Change an order status through the API or Socket.IO and show live update.
- Cancel an order from the UI and explain that it calls JSON-RPC 2.0.
- Trigger an order status change and show the SSE alert.
