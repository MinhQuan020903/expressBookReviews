const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser');


public_users.use(bodyParser.json());
public_users.use(bodyParser.urlencoded({ extended: true }));


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      // if cannot find username in users 
      //add to users array

      users.push({"username":username,"password":password});

      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000)
  })
  promise.then((books) => {
    return res.status(200).json({message: JSON.stringify(books, null, 2)});
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let isbn = req.params.isbn;
      resolve(isbn);
    }, 3000)
  })
  promise.then((isbn) => {
    if (!books[isbn]) return res.status(404).json({message: "Book not found"});
  else return res.status(200).json({message: JSON.stringify(books[isbn], null, 2)});
  })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let author = req.params.author;
      resolve(author);
    }, 3000)
  })
  promise.then((author) => {
    let bookWithRequiredAuthor = Object.values(books).filter(book => book.author === author);

    if (!bookWithRequiredAuthor) return res.status(404).json({message: "Book not found"});
    else return res.status(200).json({message: JSON.stringify(bookWithRequiredAuthor, null, 2)});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let title = req.params.title;
      resolve(title);
    }, 3000)
  })
  promise.then((title) => {
    let bookWithRequiredTitle = Object.values(books).filter(book => book.title === title);
    if (!bookWithRequiredTitle) return res.status(404).json({message: "Book not found"});
    else return res.status(200).json({message: JSON.stringify(bookWithRequiredTitle, null, 2)});
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (!books[isbn]) return res.status(404).json({message: "Book not found"});
  else return res.status(200).json({message: JSON.stringify(books[isbn].reviews, null, 2)});
});

module.exports.general = public_users;
