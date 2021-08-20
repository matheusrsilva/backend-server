const moment = require('moment');

const { database, fetch, update, getValidToken } = require('../config/database');

exports.authorize = async (method, params, headers) => {
  switch (method) {
    case 'POST': {
      const token = await getValidToken(headers.authorization);
      if (token instanceof Error) return token;
      return true;
    }
    case 'DELETE':
    case 'PUT': {
      const post = await read(params.id, true);
      const token = await getValidToken(headers.authorization);
      if (token instanceof Error) return token;

      // user by token is the same who is updated
      if (token && token.user_id === post.user_id) return true;
      return false;
    }
    default: return true;
  }
}

const read = async (id) => {
  const [post] = await fetch('post', { id });
  if (post) post.private = !! post.private;
  return post;
}
exports.read = read;

exports.authorizedRead = async (id, token) => {
  const { user_id } = (await getValidToken(token));
  const post = await read(id);
  const is_owner = post.user_id === user_id;
  const is_public = !(!!post.deleted || post.private);
  return ((is_owner || is_public) && post) || null;
}

exports.create = async (body, token) => {
  const { user_id } = (await getValidToken(token));
  const {
    content,
    private,
  } = body;

  const [post_id] = (await database('post').insert({
    user_id,
    content,
    private,
  }) || null);
  return read(post_id);
};

exports.update = async (id, body) => {
  const {
    content,
    private
  } = body;
  const fields = {};
  if (content) fields.content = content;
  if (private) fields.private = private;
  await update('post', fields, id);
  return read(id);
};

exports.delete = async (id) => {
  const fields = { deleted: moment().format('YYYY-MM-DD HH:mm:ss') };
  await update('post', fields, id);
  return read(id);
};
