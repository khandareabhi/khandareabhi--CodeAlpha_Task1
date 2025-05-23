const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Use your own MySQL password
  database: 'ecommerce'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Add product to order table
app.post('/checkout', (req, res) => {
  const cart = req.body;
  if (!Array.isArray(cart)) return res.status(400).json({ message: 'Invalid cart' });

  const values = cart.map(item => [item.id, item.quantity]);
  const sql = 'INSERT INTO orders (product_id, quantity) VALUES ?';

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order placed successfully!' });
  });
});

app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});

// Show all orders with product name and price
app.get('/orders', (req, res) => {
  const sql = `
    SELECT orders.id, products.name AS product_name, orders.quantity, products.price,
           (orders.quantity * products.price) AS total_price
    FROM orders
    JOIN products ON orders.product_id = products.id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

