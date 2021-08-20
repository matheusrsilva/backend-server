const express = require('express');
const router = express.Router();
const controller = require('../controllers/post')

router.authorize = async (method, params, headers) => {
  if(['POST', 'PUT','DELETE'].includes(method)){
    return controller.authorize(method, params, headers);
  }
  return true;
}

router.post('/', async (req, res, next) => {
  const post = await controller.create(req.body, req.headers.authorization);
  if (post) res.status(201).send(post)
  else next(new Error("Cant create post"));
});

router.get('/:id', async (req, res, next) => {
  const post = await controller.authorizedRead(req.params.id, req.headers.authorization);
  if (post) res.status(201).send(post)
  else next(new Error("Cant get this post"));
});

router.put('/:id', async (req, res, next) => {
  const post = await controller.update(req.params.id, req.body);
  if (post) res.status(201).send(post)
  else next(new Error("Cant update"));
});

router.delete('/:id', async (req, res, next) => {
  const post = await controller.delete(req.params.id);
  if (post) res.status(201).send(post)
  else next(new Error("Cant delete"));
});

router.patch('/:id', (req, res, next) => {
  next(new Error('not implemented, post PUT'));
});

module.exports = router;