const express = require('express');
const { route } = require('.');
const router = express.Router();
const controller = require('../controllers/user');
const { responseTreatment } = require('../utils');

router.authorize = async (method, params, headers) => {
  if (['PUT', 'GET'].includes(method)) {
    return await controller.authorize(method, params, headers);
  }
  return true;
}

router.post('/login', async (req, res, next) => {
  const user = await controller.login(req.body);
  responseTreatment(user,res,next, "Invalid user/password combination");
});

router.post('/', async (req, res, next) => {
  const user = await controller.create(req.body);
  responseTreatment(user,res,next, "Can't create user");
});

router.get('/', async (req, res, next) => {
  const user = await controller.readByToken(req.headers.authorization);
  responseTreatment(user,res,next, "Can't get this user");
});

router.get('/:id', async (req, res, next) => {
  const user = await controller.read(req.params.id);
  responseTreatment(user,res,next, "Can't get this user");
});

router.put('/:id', async (req, res, next) => {
  const user = await controller.update(req.params.id, req.body);
  responseTreatment(user,res,next, "Can't update this user");
});

router.patch('/:id', (req, res, next) => {
  next(new Error('not implemented, user PUT'));
});

module.exports = router;