// server.js

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Configurar el servidor
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ruta GET para obtener los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los posts');
  }
});

// Ruta POST para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)',
      [titulo, url, descripcion]
    );
    res.status(201).send('Post agregado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar el post');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
