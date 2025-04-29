const express = require('express');
const { ensureAuthenticated } = require('../middleware/ensureAuthenticated');
const FavoritesController = require('../controllers/favoritesController');

const router = express.Router();

// Adicionar uma receita aos favoritos
router.post('/', ensureAuthenticated, FavoritesController.addFavorite);

// Listar as receitas favoritedas pelo usuário
router.get('/', ensureAuthenticated, FavoritesController.listFavorites);

// Remover uma receita dos favoritos
router.delete('/:recipe_id', ensureAuthenticated, FavoritesController.removeFavorite);

module.exports = router;
