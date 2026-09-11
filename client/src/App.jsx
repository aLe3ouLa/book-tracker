import { useState, useEffect } from "react";

import "./App.css";
import { DeleteConfirmation } from "./components/DeleteConfirmation";

const API_URL = import.meta.env.VITE_BASE_URL;

const SPINE_COLORS = [
  "#b5533c",
  "#3c6e8f",
  "#5c8a4a",
  "#8a5c8a",
  "#c99a3c",
  "#4a6a5c",
];

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    rating: null,
    date_started: null,
    date_finished: null,
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

  async function handleDelete(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setBooks(books.filter((book) => book.id !== id));
  }

  function handleEdit(book) {
    setForm({
      title: book.title,
      author: book.author,
      status: book.status,
      rating: book.rating,
      date_started: book.date_started,
      date_finished: book.date_finished,
    });
    setEditingId(book.id);
  }

  async function handleSearch(e) {
    e.preventDefault();
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`,
    );
    const data = await res.json();
    setResults(data.docs);
  }

  async function handleAddFromSearch(doc) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: doc.title,
        author: doc.author_name?.[0] || "Unknown",
        status: "to-read",
      }),
    });
    const newBook = await res.json();
    setBooks([...books, newBook]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editingId) {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updatedBook = await res.json();
      setBooks(books.map((b) => (b.id === editingId ? updatedBook : b)));
      setEditingId(null);
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newBook = await res.json();
      setBooks([...books, newBook]);
    }

    setForm({
      title: "",
      author: "",
      status: "to-read",
      rating: null,
      date_started: null,
      date_finished: null,
    });
  }

  function titleFontSize(title) {
    if (title.length > 30) return "0.5rem";
    if (title.length > 18) return "0.8rem";
    return "1rem";
  }

  return (
    <div className="page">
      <h1>📚 Book Tracker</h1>
      <p className="tagline">your cozy little reading corner</p>

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
        <input
          type="number"
          name="rating"
          min="0"
          max="5"
          placeholder="Rating"
          value={!form.rating ? "" : form.rating}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_started"
          placeholder="Date started"
          value={!form.date_started ? "" : form.date_started}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_finished"
          placeholder="Date finished"
          value={!form.date_finished ? "" : form.date_finished}
          onChange={handleChange}
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="to-read">To read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
        <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                author: "",
                status: "to-read",
                rating: null,
                date_finished: null,
                date_started: null,
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <form onSubmit={handleSearch}>
        <input
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map((doc) => (
          <li key={doc.key}>
            {doc.cover_i && (
              <img
                src={`https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`}
                alt={doc.title}
              />
            )}
            {doc.title} — {doc.author_name?.[0] || "Unknown"}
            <button onClick={() => handleAddFromSearch(doc)}>
              Add to shelf
            </button>
          </li>
        ))}
      </ul>

      <div className="shelf">
        {books?.map((book, i) => (
          <div
            className="spine"
            key={book.id}
            style={{ background: SPINE_COLORS[i % SPINE_COLORS.length] }}
          >
            <div className="spine-label">
              <span
                className="spine-title"
                style={{ fontSize: titleFontSize(book.title) }}
              >
                {book.title}
              </span>
              <span className="spine-author">{book.author}</span>
              <span className={`spine-status status-${book.status}`}>
                {book.status}
              </span>
            </div>
            <div className="spine-actions">
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button
                command="show-modal"
                commandfor={`delete-dialog-${book.id}`}
              >
                Delete
              </button>
            </div>
            <DeleteConfirmation
              handleDelete={() => handleDelete(book.id)}
              book={book}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
