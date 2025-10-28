const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Se requiere nombre de usuario y contraseña" });
    }

    const user = users[username];

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos" });
    }

    const jwt = require('jsonwebtoken');
    const secretKey = "clave_secreta";

    const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });

    return res.status(200).json({ message: "Login exitoso", token: token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body; // el usuario y la reseña enviados en el body

  // Validación básica
  if (!username || !review) {
    return res.status(400).json({ message: "Se requiere username y review" });
  }

  const book = books[isbn]; // busca el libro por ISBN
  if (!book) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  // Inicializa el objeto de reseñas si no existe
  if (!book.reviews) {
    book.reviews = {};
  }

  // Agrega o modifica la reseña del usuario
  book.reviews[username] = review;

  return res.status(200).json({
    message: "Reseña agregada o modificada correctamente",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body; // el usuario que quiere borrar su reseña
  
    // Validación básica
    if (!username) {
      return res.status(400).json({ message: "Se requiere username" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No existe una reseña de este usuario para eliminar" });
    }
  
    // Eliminar la reseña del usuario
    delete book.reviews[username];
  
    return res.status(200).json({
      message: "Reseña eliminada correctamente",
      reviews: book.reviews
    });
  });
  


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
