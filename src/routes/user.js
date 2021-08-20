const express = require('express');
const { route } = require('.');
const router = express.Router();
const controller = require('../controllers/user');

router.authorize = async (method, params, headers) => {
  if (['PUT', 'GET'].includes(method)) {
    return await controller.authorize(method, params, headers);
  }
  return true;
}

router.post('/login', async (req, res, next) => {
  const user = await controller.login(req.body);
  if (user) res.status(201).send(user)
  else next(new Error("Invalid user/password combination"));
});

router.post('/', async (req, res, next) => {
  const user = await controller.create(req.body);
  if (user) res.status(201).send(user)
  else next(new Error("Cant create user"))
});

router.get('/:id', async (req, res, next) => {
  const user = await controller.read(req.params.id);
  if (user) res.status(201).send(user)
  else next(new Error("Cant get this user"));
});

router.put('/:id', async (req, res, next) => {
  const user = await controller.update(req.params.id, req.body);
  if (user) res.status(201).send(user)
  else next(new Error("Cant update this user"));
});

router.patch('/:id', (req, res, next) => {
  next(new Error('not implemented, user PUT'));
});

module.exports = router;