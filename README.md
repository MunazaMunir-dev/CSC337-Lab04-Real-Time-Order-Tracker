<img width="1920" height="1080" alt="Screenshot (306)" src="https://github.com/user-attachments/assets/d32adbb5-2eef-4b65-83e6-7348f8d7896c" />
<img width="1920" height="1080" alt="Screenshot (305)" src="https://github.com/user-attachments/assets/f389c219-d6da-4761-a1da-efdd27dd04a0" />
<img width="1920" height="1080" alt="Screenshot (304)" src="https://github.com/user-attachments/assets/4870a3e4-ada8-4424-be53-ce44d42062de" />
<img width="1920" height="1080" alt="Screenshot (303)" src="https://github.com/user-attachments/assets/394ca09b-cb66-4556-8039-d46a6a7cc91c" />
<img width="1920" height="1080" alt="Screenshot (302)" src="https://github.com/user-attachments/assets/08bd2940-e669-4cab-b77d-9fe4c7c901f6" />
<img width="1920" height="1080" alt="Screenshot (301)" src="https://github.com/user-attachments/assets/3a1339ca-b50b-44d6-ba0b-5b156400e636" />
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
