const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
public_users.get('/', function (req, res) {
    // Convierte el objeto de libros a JSON legible
    const bookList = JSON.stringify(books, null, 4);
    
    // Devuelve la respuesta con status 200
    return res.status(200).send(bookList);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Libro no encontrado" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = [];

    Object.keys(books).forEach((key) => {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    });

    if (result.length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No se encontraron libros para este autor" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = [];

    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    });

    if (result.length > 0) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ message: "No se encontró ningún libro con ese título" });
    }
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
