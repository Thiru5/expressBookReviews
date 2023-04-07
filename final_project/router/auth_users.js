const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user =>{
        return user.username === username
    }))

    return (userswithsamename.length > 0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    return (validusers.length > 0)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if(!username || !password){
        return res.status(404).json({message: "Error Logging in"})
    }

    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {
            expiresIn: 60
        })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in")
    } else {

        return res.status(208).json({message: "Invalid login. Check your credentials."})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    let review = req.body.review
    let isbn = req.body.isbn
    let name = req.session.authorization.username
    console.log(name + " is adding a review for book with isbn " + isbn)
    
    let listOfReviews = books[isbn]["reviews"]
    console.log(listOfReviews)
    let i = 1
    if(Object.keys(listOfReviews).length === 0){
        let newObj = {
            "username" : name,
            "review" : review
        }
        books[isbn]["reviews"][i] = newObj
        res.send(JSON.stringify(books[isbn]))
        return
    } else {
        console.log(Object.keys(listOfReviews).length)
        while(i <= Object.keys(listOfReviews).length){
            console.log(listOfReviews[i])
            if(listOfReviews[i]["username"] === name){
                console.log(books[isbn]["reviews"][i]["review"])
                books[isbn]["reviews"][i]["review"] = review
                console.log(books[isbn]["reviews"][i]["review"])
                break
            }
            i++
            if(i > Object.keys(listOfReviews).length){
                let newObj = {
                    "username" : name,
                    "review" : review
                }

                books[isbn]["reviews"][i] = newObj
                break
            }
        }
    }
    
    res.send(JSON.stringify(books[isbn]))
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.body.isbn
    let name = req.session.authorization.username
    console.log(name + " is removing a review for book with isbn " + isbn)

    let listOfReviews = books[isbn]["reviews"]
    console.log(listOfReviews)
    let i = 1
    console.log(Object.keys(listOfReviews).length)

    while(i <= Object.keys(listOfReviews).length) {
        if(listOfReviews[i]["username"] === name){
            delete books[isbn]["reviews"][i]
            res.send(JSON.stringify(books[isbn]))
        }
        i++
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
