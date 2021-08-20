const express = require('express');
const router = express.Router();
const controller = require('../controllers/post');
const { responseTreatment } = require('../utils');


router.authorize = async (method, params, headers) => {
  if(['POST', 'PUT','DELETE'].includes(method)){
    return controller.authorize(method, params, headers);
  }
  return true;
}

router.post('/', async (req, res, next) => {
  const post = await controller.create(req.body, req.headers.authorization);
  responseTreatment(post,res,next, "Cant create post");
});

router.get('/:id', async (req, res, next) => {
  const post = await controller.authorizedRead(req.params.id, req.headers.authorization);
  responseTreatment(post,res,next, "Cant get this post");
});

router.put('/:id', async (req, res, next) => {
  const post = await controller.update(req.params.id, req.body);
  responseTreatment(post,res,next, "Cant update this post");
});

router.delete('/:id', async (req, res, next) => {
  const post = await controller.delete(req.params.id);
  responseTreatment(post,res,next, "Cant delete this post");
});

router.patch('/:id', (req, res, next) => {
  next(new Error('not implemented, post PUT'));
});

module.exports = router;