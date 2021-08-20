const moment = require('moment');

const { database, fetch, update, getValidToken } = require('../config/database');
const { generateToken } = require('../utils');

exports.authorize = async (method, params, headers) => {
  switch(method){
    case 'GET':
    case 'PUT':{
      const token = await getValidToken(headers.authorization)
      if (token instanceof Error) return token;
      // user by token is the same who is updated
      if (token && token.user_id === parseInt(params.id, 10)) return true;
      return false;
    }
      default: return true;
  }
  
}

const read = async (id) => (await fetch('user', { id }) || [null])[0];
exports.read = read;

exports.create = async (body) => {
  const {
    username,
    password,
    fullname,
    date_of_birth
  } = body;

  const [user_id] = (await database('user').insert({
    username,
    password,
    fullname,
    date_of_birth
  }) || null);

  return read(user_id);
};

exports.update = async (id, body) => {
  const {
    fullname,
    date_of_birth
  } = body;

  const fields = {};
  if (fullname) fields.fullname = fullname;
  if (date_of_birth) fields.date_of_birth = date_of_birth;

  await update('user', fields, id);
  return read(id);
};

exports.login = async (body) => {
  const {
    username,
    password,
  } = body;

  const [user] = await fetch('user', { username, password })
  const [token] = await fetch('token', { user_id: user.id })
  
  if (token) {
    if (moment(token.expiration, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())) {
      const newToken = generateToken();
      await update('token', {
        token: newToken,
        expiration: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }, token.id);
      return { token: newToken };
    }
    return { token: token.token };
  } else {
    const token = generateToken();
    await database('token').insert({
      user_id: user.id,
      token,
      expiration: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
    });
    return { token };
  }

};