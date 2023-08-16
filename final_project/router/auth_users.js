const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

regd_users.use(express.json());
regd_users.use(express.urlencoded({extended: true}));

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if (users.find(user => user.username === username)) return true;
  else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if (users.find(user => user.username === username && user.password === password)) return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign( 
      {
        data: password,
      },
      "access",
      {
        expiresIn: 60 * 60,
      }
    );

    req.session.authorization = { accessToken, username };

    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid login. Please check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Check if user is authenticated and session exists
  if (req.session && req.session.authorization && req.session.authorization.username) {
    const isbn = req.params.isbn;
    const review = req.body.review;
    
    // Assuming 'books' is defined somewhere
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[req.session.authorization.username] = review;

    return res.status(200).json({
      message: "Review succeeded",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

//Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  delete books[isbn].reviews[req.session.authorization.username];
  return res.status(200).json({
    message: "Review deleted",
    reviews: books[isbn].reviews
  });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
