
const express = require('express');
const fetch = require('node-fetch');


const app = express();

const port = 3000;

app.use(express.static('public'));

app.get('/personajes', async (req, res) => {
  try {
    const apiUrl = 'https://rickandmortyapi.com/api/character';
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos de personajes:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener datos de personajes' });
  }
});


app.get('/buscar', async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Parámetros de búsqueda faltantes' });
    }

    const apiUrl = `https://rickandmortyapi.com/api/character/?name=${searchTerm}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});