// src/app.js

const express = require('express');
const cors = require('cors');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const testRoutes = require('./routes/test');
const favoritesRoutes = require('./routes/favorites');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/test', testRoutes);
app.use('/favorites', favoritesRoutes);

module.exports = app;
