const { runQuery, getQuery, allQuery } = require('../database/db');

async function addFavorite(req, res) {
  const userId = req.user.id;
  const { recipe_id } = req.body;

  if (!recipe_id) {
    return res.status(400).json({ error: 'O ID da receita é obrigatório.' });
  }

  try {
    // Verifica se a receita existe
    const recipe = await getQuery('SELECT * FROM recipes WHERE id = ?', [recipe_id]);
    if (!recipe) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    // Insere o favorito
    await runQuery('INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)', [userId, recipe_id]);
    res.status(201).json({ message: 'Receita favoritada com sucesso!' });
  } catch (error) {
    console.error('Erro ao favoritar receita:', error);
    res.status(500).json({ error: 'Erro interno ao favoritar a receita.' });
  }
}

async function listFavorites(req, res) {
  const userId = req.user.id;

  try {
    const favorites = await allQuery(`
      SELECT recipes.* 
      FROM recipes
      INNER JOIN favorites ON recipes.id = favorites.recipe_id
      WHERE favorites.user_id = ?
    `, [userId]);

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({ error: 'Erro interno ao listar favoritos.' });
  }
}

async function removeFavorite(req, res) {
  const userId = req.user.id;
  const { recipe_id } = req.params;

  if (!recipe_id) {
    return res.status(400).json({ error: 'O ID da receita é obrigatório.' });
  }

  try {
    // Verifica se o favorito existe antes de tentar deletar
    const favorite = await getQuery('SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?', [userId, recipe_id]);
    if (!favorite) {
      return res.status(404).json({ error: 'Favorito não encontrado.' });
    }

    // Deleta o favorito
    await runQuery('DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?', [userId, recipe_id]);
    res.status(200).json({ message: 'Receita desfavoritada com sucesso!' });
  } catch (error) {
    console.error('Erro ao desfavoritar receita:', error);
    res.status(500).json({ error: 'Erro interno ao desfavoritar a receita.' });
  }
}

module.exports = {
  addFavorite,
  listFavorites,
  removeFavorite,
};
