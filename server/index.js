require('dotenv').config(); // Loads variables from .env into process.env
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const pool = require('./db/pool');


app.use(cors()); //  allows your Vite dev server (different port) to call this API without the browser blocking it.
app.use(express.json()); //is middleware that parses incoming JSON request bodies so req.body works later for POST/PUT.

app.get('/', (req, res) => {
    res.send('Book tracker API is running');
});

app.get('/api/test-db', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
});

app.get('/api/books', async (req, res) => {
    const result = await pool.query('SELECT * from books');
    res.json(result.rows);
});

app.post('/api/books', async (req, res) => {
    const { title, author, status, rating, date_started, date_finished } = req.body;
    const result = await pool.query(
        `INSERT INTO books (title, author, status, rating, date_started, date_finished)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
        [title, author, status, rating, date_started, date_finished]
    );
    res.status(201).json(result.rows[0]);
});

app.get('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM BOOKS WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found'});
    }

    res.json(result.rows[0]);
});

app.put('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const fields = ['title', 'author', 'status', 'rating', 'date_started', 'date_finished'];
    const updates = fields.filter((field) => field in req.body);

     if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = updates.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = updates.map((field) => req.body[field]);

    const result = await pool.query(
        `UPDATE books SET ${setClause} WHERE id = $${updates.length + 1} RETURNING *`,
        [...values, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(result.rows[0]);
});

app.delete('/api/books/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});