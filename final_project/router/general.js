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
public_users.get('/', async function (req, res) {
    const data = await JSON.stringify(books)
    res.send(data)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try{
        console.log("Isbn called")
        let isbn = req.body.isbn
        console.log(isbn)
        res.send(JSON.stringify(books[isbn]))

    } catch(err) {

    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    console.log("GET Author")
    let author = req.body.author
    console.log(author)
    let authorBookList = []
    let i = 1
    while(i < Object.keys(books).length){
        console.log(books[i]["author"])
        if (books[i]["author"] === author){
            authorBookList.push(books[i])
        }
        i++
    }

    res.send(JSON.stringify(authorBookList))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.body.title
    let titleBookList = []
    let i = 1
    while(i < Object.keys(books).length){
        if (books[i]['title'] === title){
            titleBookList.push(books[i])
        }
        i++
    }

    res.send(JSON.stringify(titleBookList))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.body.isbn

    res.send(JSON.stringify(books[isbn]['reviews']))

});


//TASK 10 Get the book list available in the shop
const getBookList = async (req,res) => {

    try{
        const data = await axios.get('/').then((response)=>{
            return response.status(200).json(response.data)
        })
    } catch(err) {
        console.log(err)
    }
    
}

//TASK 11 Get book details based on ISBN

const getBookByISBN = async (req,res) =>{
    try{
        const data = await axios.get('/isbn/:isbn',{
            params: {
                isbn: req.body.isbn
            }
        }).then((response)=>{
            return response.status(200).json(response.data)
        })

    } catch(err) {
        console.log(err)

    }
    
}

//TASK 12
const getBookByAuthor = async (req,res) =>{
    try {
        const data = await axios.get('/author/:author',{
            params: {
                author: req.body.author
            }
        }).then((response)=>{
            return response.status(200).json(response.data)
        })

    } catch(err){

        console.log(error)
    }
    
}

//TASK 13
const getBooksByTitle = async (req,res) =>{
    try {
        const data = await axios.get('/title/:title',{
            params: {
                title: req.body.title
            }
        }).then((response)=>{
            return response.status(200).json(response.data)
        })

    } catch(err){

        console.log(error)
    }
    
}


module.exports.general = public_users;
