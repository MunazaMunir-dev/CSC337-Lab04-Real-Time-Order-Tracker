// import express from 'express';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
// });

// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// const catalog = [
//   { id: 'p1', name: 'Wireless Headphones', price: 6500, stock: 20 },
//   { id: 'p2', name: 'Smart Watch', price: 8500, stock: 15 },
//   { id: 'p3', name: 'Mechanical Keyboard', price: 7200, stock: 10 },
//   { id: 'p4', name: 'USB-C Hub', price: 3200, stock: 30 }
// ];

// let orders = [
//   { id: 'ORD-1001', customer: 'Ali Khan', product: 'Wireless Headphones', total: 6500, status: 'Processing', createdAt: new Date().toISOString() },
//   { id: 'ORD-1002', customer: 'Sara Ahmed', product: 'Smart Watch', total: 8500, status: 'Shipped', createdAt: new Date().toISOString() }
// ];

// const sseClients = new Set();

// function sendEvent(event, data) {
//   const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
//   for (const res of sseClients) res.write(payload);
// }

// function broadcastOrder(order) {
//   io.emit('orderStatusUpdated', order);
//   sendEvent('orderAlert', {
//     message: `Order ${order.id} is now ${order.status}`,
//     order
//   });
// }

// app.get('/', (req, res) => {
//   res.json({ service: 'CSC337 Real-Time Order Tracker & Live Support API', status: 'running' });
// });

// // REST: catalog
// app.get('/api/v1/catalog', (req, res) => res.json(catalog));

// // REST: orders
// app.get('/api/v1/orders', (req, res) => res.json(orders));

// app.get('/api/v1/orders/:id', (req, res) => {
//   const order = orders.find(o => o.id === req.params.id);
//   if (!order) return res.status(404).json({ error: 'Order not found' });
//   res.json(order);
// });

// app.patch('/api/v1/orders/:id/status', (req, res) => {
//   const { status } = req.body;
//   const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
//   if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
//   const order = orders.find(o => o.id === req.params.id);
//   if (!order) return res.status(404).json({ error: 'Order not found' });
//   order.status = status;
//   broadcastOrder(order);
//   res.json(order);
// });

// // JSON-RPC 2.0
// app.post('/rpc', (req, res) => {
//   const { jsonrpc, method, params, id } = req.body;
//   if (jsonrpc !== '2.0' || !method) {
//     return res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id: id ?? null });
//   }

//   if (method === 'cancelOrder') {
//     const orderId = params?.orderId;
//     const order = orders.find(o => o.id === orderId);
//     if (!order) {
//       return res.json({ jsonrpc: '2.0', error: { code: -32004, message: 'Order not found' }, id });
//     }
//     if (order.status === 'Delivered') {
//       return res.json({ jsonrpc: '2.0', error: { code: -32005, message: 'Delivered orders cannot be cancelled' }, id });
//     }
//     order.status = 'Cancelled';
//     broadcastOrder(order);
//     return res.json({ jsonrpc: '2.0', result: { success: true, order }, id });
//   }

//   res.json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
// });

// // SSE: live alerts
// app.get('/events', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();
//   res.write(`event: connected\ndata: ${JSON.stringify({ message: 'SSE connected' })}\n\n`);
//   sseClients.add(res);

//   const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 20000);
//   req.on('close', () => {
//     clearInterval(heartbeat);
//     sseClients.delete(res);
//   });
// });

// // Socket.IO: real-time updates + 1-to-1 support chat
// io.on('connection', socket => {
//   socket.emit('connected', { socketId: socket.id });

//   socket.on('joinSupportRoom', ({ roomId }) => {
//     if (!roomId) return;
//     socket.join(roomId);
//     socket.emit('roomJoined', { roomId });
//   });

//   socket.on('supportMessage', ({ roomId, sender, message }) => {
//     if (!roomId || !message?.trim()) return;
//     const payload = {
//       roomId,
//       sender: sender || 'Customer',
//       message: message.trim(),
//       sentAt: new Date().toISOString()
//     };
//     io.to(roomId).emit('supportMessage', payload);
//   });

//   socket.on('updateOrderStatus', ({ orderId, status }) => {
//     const order = orders.find(o => o.id === orderId);
//     const allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
//     if (!order || !allowed.includes(status)) return;
//     order.status = status;
//     broadcastOrder(order);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });



import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
  }
});

app.use(cors());
app.use(express.json());

const catalog = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    price: 6500,
    stock: 20
  },
  {
    id: 'p2',
    name: 'Smart Watch',
    price: 8500,
    stock: 15
  },
  {
    id: 'p3',
    name: 'Mechanical Keyboard',
    price: 7200,
    stock: 10
  },
  {
    id: 'p4',
    name: 'USB-C Hub',
    price: 3200,
    stock: 30
  }
];

let orders = [
  {
    id: 'ORD-1001',
    customer: 'Ali Khan',
    product: 'Wireless Headphones',
    total: 6500,
    status: 'Processing',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-1002',
    customer: 'Sara Ahmed',
    product: 'Smart Watch',
    total: 8500,
    status: 'Shipped',
    createdAt: new Date().toISOString()
  }
];

const sseClients = new Set();

function sendEvent(event, data) {
  const payload =
    `event: ${event}\n` +
    `data: ${JSON.stringify(data)}\n\n`;

  for (const res of sseClients) {
    res.write(payload);
  }
}

function broadcastOrder(order) {
  io.emit('orderStatusUpdated', order);

  sendEvent('orderAlert', {
    message: `Order ${order.id} is now ${order.status}`,
    order
  });
}

/* =========================
   HEALTH CHECK
========================= */

app.get('/', (req, res) => {
  res.json({
    service: 'CSC337 Real-Time Order Tracker & Live Support API',
    status: 'running'
  });
});

/* =========================
   REST — CATALOG
========================= */

app.get('/api/v1/catalog', (req, res) => {
  res.json(catalog);
});

/* =========================
   REST — ORDERS
========================= */

app.get('/api/v1/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/v1/orders/:id', (req, res) => {
  const order = orders.find(
    (o) => o.id === req.params.id
  );

  if (!order) {
    return res.status(404).json({
      error: 'Order not found'
    });
  }

  res.json(order);
});

/* =========================
   REST — UPDATE STATUS
========================= */

app.patch('/api/v1/orders/:id/status', (req, res) => {
  const { status } = req.body;

  const allowed = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status'
    });
  }

  const order = orders.find(
    (o) => o.id === req.params.id
  );

  if (!order) {
    return res.status(404).json({
      error: 'Order not found'
    });
  }

  order.status = status;

  broadcastOrder(order);

  res.json(order);
});

/* =========================
   JSON-RPC 2.0
========================= */

app.post('/rpc', (req, res) => {
  const {
    jsonrpc,
    method,
    params,
    id
  } = req.body;

  if (jsonrpc !== '2.0' || !method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      },
      id: id ?? null
    });
  }

  if (method === 'cancelOrder') {
    const orderId = params?.orderId;

    const order = orders.find(
      (o) => o.id === orderId
    );

    if (!order) {
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32004,
          message: 'Order not found'
        },
        id
      });
    }

    if (order.status === 'Delivered') {
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32005,
          message: 'Delivered orders cannot be cancelled'
        },
        id
      });
    }

    order.status = 'Cancelled';

    broadcastOrder(order);

    return res.json({
      jsonrpc: '2.0',
      result: {
        success: true,
        order
      },
      id
    });
  }

  return res.json({
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: 'Method not found'
    },
    id
  });
});

/* =========================
   SSE — LIVE ALERTS
========================= */

app.get('/events', (req, res) => {
  res.setHeader(
    'Content-Type',
    'text/event-stream'
  );

  res.setHeader(
    'Cache-Control',
    'no-cache, no-transform'
  );

  res.setHeader(
    'Connection',
    'keep-alive'
  );

  res.flushHeaders();

  res.write(
    `event: connected\n` +
    `data: ${JSON.stringify({
      message: 'SSE connected'
    })}\n\n`
  );

  sseClients.add(res);

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

/* =========================
   SOCKET.IO
========================= */

io.on('connection', (socket) => {

  socket.emit('connected', {
    socketId: socket.id
  });

  socket.on(
    'joinSupportRoom',
    ({ roomId }) => {

      if (!roomId) return;

      socket.join(roomId);

      socket.emit('roomJoined', {
        roomId
      });
    }
  );

  socket.on(
    'supportMessage',
    ({ roomId, sender, message }) => {

      if (
        !roomId ||
        !message?.trim()
      ) {
        return;
      }

      const payload = {
        roomId,
        sender: sender || 'Customer',
        message: message.trim(),
        sentAt: new Date().toISOString()
      };

      io.to(roomId).emit(
        'supportMessage',
        payload
      );
    }
  );

  socket.on(
    'updateOrderStatus',
    ({ orderId, status }) => {

      const allowed = [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ];

      const order = orders.find(
        (o) => o.id === orderId
      );

      if (
        !order ||
        !allowed.includes(status)
      ) {
        return;
      }

      order.status = status;

      broadcastOrder(order);
    }
  );
});

/*
  IMPORTANT:
  Do NOT use server.listen() on Vercel.
  Vercel starts the server for us.
*/

export default server;