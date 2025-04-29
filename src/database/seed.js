// database/seed.js

const db = require('./db').db;  // Agora importa diretamente a instância db
const bcrypt = require('bcryptjs');

// Dados de receitas
const recipes = [
  { title: 'Bolo de Chocolate', ingredients: 'farinha, açúcar, chocolate, ovos, leite', steps: 'Misture tudo e asse por 40 minutos.', category: 'Doces', difficulty: 'Fácil' },
  { title: 'Lasanha', ingredients: 'massa, carne moída, queijo, molho de tomate', steps: 'Monte camadas e leve ao forno.', category: 'Almoço', difficulty: 'Médio' },
  { title: 'Salada Caesar', ingredients: 'alface, frango, croutons, parmesão, molho', steps: 'Misture os ingredientes e adicione o molho.', category: 'Saladas', difficulty: 'Fácil' },
  { title: 'Feijoada', ingredients: 'feijão preto, carnes, arroz, couve, laranja', steps: 'Cozinhe tudo junto por algumas horas.', category: 'Almoço', difficulty: 'Difícil' },
  { title: 'Panqueca', ingredients: 'farinha, ovos, leite, sal, manteiga', steps: 'Faça a massa, frite e adicione o recheio.', category: 'Café da Manhã', difficulty: 'Fácil' },
  { title: 'Strogonoff de Frango', ingredients: 'frango, creme de leite, ketchup, arroz, batata palha', steps: 'Cozinhe o frango e misture com os outros ingredientes.', category: 'Almoço', difficulty: 'Médio' },
  { title: 'Brigadeiro', ingredients: 'leite condensado, chocolate, manteiga', steps: 'Cozinhe até desgrudar da panela.', category: 'Doces', difficulty: 'Fácil' },
  { title: 'Torta de Limão', ingredients: 'biscoito, leite condensado, limão, creme de leite', steps: 'Monte as camadas e leve à geladeira.', category: 'Sobremesas', difficulty: 'Médio' },
  { title: 'Coxinha', ingredients: 'massa de batata, frango desfiado, farinha de rosca', steps: 'Modele, recheie, empane e frite.', category: 'Salgados', difficulty: 'Difícil' },
  { title: 'Macarrão à Carbonara', ingredients: 'macarrão, ovos, bacon, queijo, pimenta', steps: 'Cozinhe o macarrão e misture os ingredientes.', category: 'Jantar', difficulty: 'Médio' }
];

// Dados de usuários
const users = [
  { name: 'Ana Paula', email: 'ana@example.com', password: '123456' },
  { name: 'Cleiton', email: 'cleiton@example.com', password: '123456' },
  { name: 'Jarbas', email: 'jarbas@example.com', password: '123456' }
];

// Função para criar todas as tabelas necessárias
function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Criar tabela de receitas
      db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          ingredients TEXT NOT NULL,
          steps TEXT NOT NULL,
          category TEXT NOT NULL,
          difficulty TEXT NOT NULL
        )
      `);

      // Criar tabela de usuários
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          is_admin INTEGER DEFAULT 0
        )
      `);

      // Criar tabela de favoritos
      db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          recipe_id INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        )
      `);

      // Se não houver erros na criação, resolvemos a promise
      resolve();
    });
  });
}

// Função para inserir receitas
async function insertRecipes() {
  for (let r of recipes) {
    db.run(
      `INSERT INTO recipes (title, ingredients, steps, category, difficulty) VALUES (?, ?, ?, ?, ?)`,
      [r.title, r.ingredients, r.steps, r.category, r.difficulty],
      function (err) {
        if (err) {
          console.error('Erro ao inserir receita:', err.message);
        } else {
          console.log(`✅ Receita inserida: ${r.title}`);
        }
      }
    );
  }
}

// Função para inserir usuários
async function insertUsers() {
  for (let u of users) {
    const hashed = bcrypt.hashSync(u.password, 8);
    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [u.name, u.email, hashed],
      function (err) {
        if (err) {
          console.error('Erro ao inserir usuário:', err.message);
        } else {
          console.log(`👤 Usuário inserido: ${u.name}`);
        }
      }
    );
  }
}

// Função de seed
async function seedDatabase() {
  try {
    console.log("Conectado ao banco SQLite");

    await createTables();  // Garante que todas as tabelas sejam criadas primeiro
    await insertRecipes();  // Insere as receitas
    await insertUsers();    // Insere os usuários

    console.log('✅ Seed concluído com sucesso!');
  } catch (err) {
    console.error('Erro no processo de seed:', err);
  }
}

seedDatabase();
