// routes/test.js

const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/ensureAuthenticated');

router.get('/private', ensureAuthenticated, (req, res) => {
  res.json({ message: `Olá, usuário ID ${req.user.id}` });
});

router.get('/admin-only', ensureAuthenticated, ensureAdmin, (req, res) => {
  res.json({ message: `Olá admin ID ${req.user.id}` });
});

module.exports = router;
