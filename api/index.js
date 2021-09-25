// For all the routes that start with /api
const express = require('express')

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET } = process.env;


const apiRouter = express.Router()
const userRouter = require('./users')
const postsRouter = require('./posts')
const tagsRouter = require('./tags')

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});



// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer '
  const auth = req.header('Authorization')

  if (!auth) {
    // nothing to see here
    next()
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length)

    try {
      // decrypting the token back to a user object and grabbing the user id
      const { id } = jwt.verify(token, JWT_SECRET)

      if (id) {
        req.user = await getUserById(id)
        next()
      }
    } catch ({ name, message }) {
      next({ name, message })
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    })
  }
})

apiRouter.use((req, res, next) => {
  console.log('I am in the api routes')

  console.log(req.user) // are they logged in?
  //   res.send({ message: 'hello from /api!' })
  next()
})



apiRouter.use('/users', userRouter)
apiRouter.use('/posts', postsRouter)
apiRouter.use('/tags', tagsRouter)

// all routers attached ABOVE here
apiRouter.use((error, req, res, next) => {
  res.send(error);
});


module.exports = apiRouter