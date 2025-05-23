
// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Insert order
router.post('/place', (req, res) => {
  const { user_id, product_id, quantity, total_price } = req.body;
  const sql = 'INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)';
  db.query(sql, [user_id, product_id, quantity, total_price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Order placed successfully');
  });
});

// Get orders for user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM orders WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
