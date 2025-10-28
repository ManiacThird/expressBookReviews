const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Se requiere nombre de usuario y contraseña" });
    }

    if (users[username]) {
        return res.status(409).json({ message: "El usuario ya existe" });
    }

    users[username] = { password: password };
    return res.status(201).json({ message: "Usuario registrado exitosamente" });
});


// Get the book list available in the shop
// Tarea 10: Obtener lista de libros usando async/await con Axios
public_users.get('/', async (req, res) => {
    try {
      // Simulamos la obtención con una promesa
      const response = await new Promise((resolve) => {
        setTimeout(() => resolve({ data: books }), 500);
      });
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener libros", error: err });
    }
  });
  


// Get book details based on ISBN
// Tarea 11: Obtener detalles del libro por ISBN usando async/await con Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve({ data: book });
        else reject("Libro no encontrado");
      });
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  });
  

  
// Get book details based on author
// Tarea 12: Obtener libros por autor usando Promesas con Axios
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
  
    new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
      if (matchingBooks.length > 0) resolve(matchingBooks);
      else reject("No se encontraron libros para este autor");
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });
  
// Get all books based on title
// Tarea 13: Obtener libro por título usando Promesas con Axios
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
  
    new Promise((resolve, reject) => {
      const foundBooks = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
      if (foundBooks.length > 0) resolve(foundBooks);
      else reject("Libro no encontrado con ese título");
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });
  


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No se encontraron reseñas para este libro" });
    }
});


module.exports.general = public_users;
