// api/users.js
const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db')

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});

tagsRouter.get('/', async (req, res) => {
    let tags = await getAllTags()

  res.send({
    message: 'hello from /tags!', 
    tags
  });
});

module.exports = tagsRouter;