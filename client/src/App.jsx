import { useState, useEffect } from "react";

import "./App.css";

const API_URL = "http://localhost:4000/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    status: "to-read",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newBook = await res.json();
    setBooks([...books, newBook]);
    setForm({ title: "", author: "", status: "to-read" });
  }

  return (
    <div>
      <h1>Book Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="to-read">To read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books?.map((book) => (
          <li key={book.id}>
            {book.title} — {book.author} ({book.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
