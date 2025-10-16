const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // stores registered users

// Check if username already exists
const isValid = (username) => {
  return users.some(u => u.username === username);
}

// Authenticate user with username & password
const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
}

// Task 6: Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 7: Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  req.session.authorization = { username, accessToken: token };
  return res.status(200).json({ message: "User logged in", token });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session?.authorization?.username;

  if (!username) return res.status(401).json({ message: "Please login first" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  books[isbn].reviews[username] = review; // add or overwrite
  return res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session?.authorization?.username;

  if (!username) return res.status(401).json({ message: "Please login first" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "No review found by this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
