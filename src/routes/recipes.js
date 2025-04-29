// routes/recipes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipesController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/ensureAuthenticated');

// Rotas públicas
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Rotas protegidas (usuário autenticado e admin)
router.post('/', ensureAuthenticated, ensureAdmin, controller.create);
router.delete('/:id', ensureAuthenticated, ensureAdmin, controller.delete);
router.put('/:id', ensureAuthenticated, ensureAdmin, controller.update);

module.exports = router;
