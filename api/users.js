// api/users.js
const express = require('express');
const usersRouter = express.Router();
const { getAllUsers } = require('../db')

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

usersRouter.get('/', async (req, res) => {
    let users = await getAllUsers()

  res.send({
    message: 'hello from /users!', 
    users 
  });
});

module.exports = usersRouter;