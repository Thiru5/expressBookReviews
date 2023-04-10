const axios = require('axios')
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(!isValid(username)) {

            users.push({"username": username, "password":password})
            return res.status(200).json({message: "User successfully registered"})

        } else {
            return res.status(404).json({message: "User already exists!"});    
          }
    } 
    return res.status(404).json({message: "Unable to register user."});
});


//Get the book list available in the shop
public_users.get('/',  function (req, res) {
    getBookList().then((data)=>{
        res.send(data)
    }).catch((err) =>{
        console.log(err)
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try{
        console.log("Isbn called")
        let isbn = req.body.isbn
        getBookByISBN(isbn).then((data)=>{
            res.send(data)
        })

    } catch(err) {
        console.log(err)
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    console.log("GET Author")
    let author = req.body.author
    console.log(author)
    getBookByAuthor(author).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log(err)
    })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.body.title
    getBooksByTitle(title).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        console.log(err)
    })
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.body.isbn

    res.send(JSON.stringify(books[isbn]['reviews']))

});


//TASK 10 Get the book list available in the shop
const getBookList = () => {
    
    return new Promise((resolve,reject) => {
        resolve(JSON.stringify(books))
    })
}

//TASK 11 Get book details based on ISBN

const getBookByISBN = (isbn) =>{

    return new Promise((resolve,reject) => {
        resolve(JSON.stringify(books[isbn]))
    })
    
}

//TASK 12
const getBookByAuthor =  (author) => {


    return new Promise((resolve, reject) => {
        let authorBookList = []
        let i = 1
        while(i < Object.keys(books).length){
            console.log(books[i]["author"])
            if (books[i]["author"] === author){
                authorBookList.push(books[i])
            }
            i++
        }

        resolve(JSON.stringify(authorBookList))
    })
    
}

//TASK 13
const getBooksByTitle =  (title) =>{
    
    return new Promise((resolve,reject)=>{
        let titleBookList = []
        let i = 1
        while(i < Object.keys(books).length){
            if (books[i]['title'] === title){
                titleBookList.push(books[i])
            }
            i++
        }

        resolve(JSON.stringify(titleBookList))
    })
    
}


module.exports.general = public_users;
