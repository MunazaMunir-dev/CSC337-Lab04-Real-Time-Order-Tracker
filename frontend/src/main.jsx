import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'https://csc-337-lab04-real-time-order-track-teal.vercel.app';

function App() {
  const [orders, setOrders] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/v1/orders`).then(r => r.json()).then(setOrders);
    fetch(`${API}/api/v1/catalog`).then(r => r.json()).then(setCatalog);

    const socket = io(API);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('orderStatusUpdated', order => {
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      setAlerts(prev => [{ message: `Order ${order.id}: ${order.status}`, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
    });

    socket.emit('joinSupportRoom', { roomId: 'support-room-1' });
    socket.on('supportMessage', data => setMessages(prev => [...prev, data]));

    const source = new EventSource(`${API}/events`);
    source.addEventListener('orderAlert', event => {
      const data = JSON.parse(event.data);
      setAlerts(prev => [{ message: data.message, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 8));
    });

    return () => { socket.disconnect(); source.close(); };
  }, []);

  async function cancelOrder(orderId) {
    const response = await fetch(`${API}/rpc`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'cancelOrder', params: { orderId }, id: Date.now() })
    });
    const data = await response.json();
    if (data.result?.order) setOrders(prev => prev.map(o => o.id === orderId ? data.result.order : o));
    if (data.error) alert(data.error.message);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;
    const socket = io(API);
    socket.emit('joinSupportRoom', { roomId: 'support-room-1' });
    socket.emit('supportMessage', { roomId: 'support-room-1', sender: 'Customer', message });
    setMessage('');
    setTimeout(() => socket.disconnect(), 300);
  }

  return <div className="app">
    <header><div><p className="eyebrow">CSC337 · LAB ASSIGNMENT 04</p><h1>Real-Time Order Tracker & Live Support</h1><p>REST + WebSockets + JSON-RPC + SSE</p></div><span className={connected ? 'status online' : 'status'}>{connected ? '● Live' : '○ Offline'}</span></header>

    <main>
      <section className="grid two">
        <div className="card"><h2>Orders</h2>{orders.map(order => <div className="order" key={order.id}><div><strong>{order.id}</strong><p>{order.customer} · {order.product}</p></div><span className={`badge ${order.status.toLowerCase()}`}>{order.status}</span><button disabled={order.status === 'Cancelled' || order.status === 'Delivered'} onClick={() => cancelOrder(order.id)}>Cancel</button></div>)}</div>
        <div className="card"><h2>Live Alerts (SSE)</h2>{alerts.length === 0 ? <p className="muted">Waiting for server events…</p> : alerts.map((a, i) => <div className="alert" key={i}><strong>{a.message}</strong><small>{a.time}</small></div>)}</div>
      </section>

      <section className="grid two">
        <div className="card"><h2>Catalog — REST</h2>{catalog.map(p => <div className="product" key={p.id}><span>{p.name}</span><strong>PKR {p.price.toLocaleString()}</strong><small>Stock: {p.stock}</small></div>)}</div>
        <div className="card"><h2>1-to-1 Live Support — WebSocket</h2><div className="chat">{messages.map((m, i) => <div className="bubble" key={i}><b>{m.sender}</b><br/>{m.message}</div>)}</div><form onSubmit={sendMessage}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a support message…"/><button>Send</button></form></div>
      </section>
    </main>
    <footer>CSC337 Lab 04 · Real-time communication protocols demonstration</footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
