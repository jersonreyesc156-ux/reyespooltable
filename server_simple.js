const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// API Routes
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
    res.json(products);
  } catch (error) {
    res.json([]);
  }
});

app.get('/api/business-info', (req, res) => {
  res.json({
    businessName: "Reyes Pool Tables",
    tagline: "",
    phone: "0907-744-9122",
    email: "",
    facebook: "https://www.facebook.com/people/Reyes-Pool-Table/100094387630000/",
    location: "Paniqui, Tarlac"
  });
});

app.post('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    orders.push(newOrder);
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
    res.json({ message: "Order submitted successfully.", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to save order." });
  }
});

// Admin routes (simplified)
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === 'reyes2024!') {
    res.json({ message: "Login successful.", token: "admin-token-123" });
  } else {
    res.status(401).json({ message: "Invalid password." });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    res.json(orders.reverse());
  } catch (error) {
    res.json([]);
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    const filteredOrders = orders.filter(order => order.id !== parseInt(req.params.id));
    fs.writeFileSync('orders.json', JSON.stringify(filteredOrders, null, 2));
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
