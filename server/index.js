require('dotenv').config(); // Loads variables from .env into process.env
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); //  allows your Vite dev server (different port) to call this API without the browser blocking it.
app.use(express.json()); //is middleware that parses incoming JSON request bodies so req.body works later for POST/PUT.

app.get('/', (req, res) => {
    res.send('Book tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});