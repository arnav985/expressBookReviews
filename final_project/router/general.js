const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
const public_users = express.Router();

// Task 1 (async) - Get all books
public_users.get('/async/all', async (req, res) => {
  try {
    // Simulate async using Promise (here just resolving immediately)
    const allBooks = await new Promise((resolve) => resolve(books));
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 11 - Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve) => resolve(books[isbn]));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 12 - Get books by author
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const filtered = await new Promise((resolve) => {
      const arr = Object.values(books).filter(b => b.author.toLowerCase() === author);
      resolve(arr);
    });
    if (filtered.length === 0) return res.status(404).json({ message: "No books found for this author" });
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task 13 - Get books by title
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const filtered = await new Promise((resolve) => {
      const arr = Object.values(books).filter(b => b.title.toLowerCase() === title);
      resolve(arr);
    });
    if (filtered.length === 0) return res.status(404).json({ message: "No books found with this title" });
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports.general = public_users;
