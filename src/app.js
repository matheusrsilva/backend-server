const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Rotas
const index = require('./routes/index');
const routes = {};
routes.user = require('./routes/user');
routes.post = require('./routes/post');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', index);
app.use('/:page/:id?', async (req, res, next) => {
  const authorize = await routes[req.params.page].authorize(req.method, req.params, req.headers);
  if (authorize) {
    //if token is invalid the function will return an error
    if (authorize instanceof Error)
      next(authorize);
    next();
  }
  else
    next(new Error("Not Authorized"));
});
app.use('/user', routes.user);
app.use('/post', routes.post);

module.exports = app;