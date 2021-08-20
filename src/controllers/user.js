const moment = require('moment');

const { database, fetch, update, getValidToken } = require('../config/database');
const { generateToken, validateEmail, cryptPassword, checkPassword } = require('../utils');

exports.authorize = async (method, params, headers) => {
  switch (method) {
    case 'PUT': {
      const token = await getValidToken(headers.authorization)
      if (token instanceof Error) return token;
      // user by token is the same who is updated
      if (token && token.user_id === parseInt(params.id, 10)) return true;
      return false;
    }
    default: return true;
  }
}

exports.authorizedRead = async (id, token) => {
  const foundToken = await getValidToken(token);
  const user = await read(id);

  if (user && (foundToken.user_id !== user.id)){
    delete user.username;
    delete user.created;
    delete user.modified;
  }

  return user;
}

const read = async (id, keep_password = false) => {
  const [user] = await fetch('user', { id });
  if (user && !keep_password)
    delete user.password;
  return user;
}
exports.read = read;

exports.readByToken = async (token) => {
  const foundToken = await getValidToken(token);
  if (foundToken instanceof Error) return foundToken;

  const [user] = await fetch('user', { id: foundToken.user_id });
  delete user.password;
  return user;
}

exports.create = async (body) => {
  const {
    username,
    password,
    fullname,
    date_of_birth
  } = body;

  if (!(username && validateEmail(username))) return new Error('Invalid Username, must be a valid email');
  const [oldUser] = await fetch('user', { username });
  if (oldUser) return new Error('Email is in use already');
  if (!password) return new Error('Password is Required');
  if (!fullname) return new Error('Fullname is Required');

  const cryptoPass = await cryptPassword(password);

  const [user_id] = (await database('user').insert({
    username,
    password: cryptoPass,
    fullname,
    date_of_birth
  }) || null);

  return read(user_id);
};

exports.update = async (id, body) => {
  const {
    fullname,
    date_of_birth,
    password,
    old_password
  } = body;

  const fields = {};
  if (fullname) fields.fullname = fullname;
  if (date_of_birth) fields.date_of_birth = date_of_birth;
  if (password) {
    if (!old_password) return new Error("Need old_password to set a new password");
    const user = await read(id, true);
    const isValidPassword = await checkPassword(old_password, user.password);
    if (!isValidPassword) return new Error("old_password doesn't match");
    fields.password = await cryptPassword(password);
  }
  await update('user', fields, id);
  return read(id);
};

exports.login = async (body) => {
  const {
    username,
    password,
  } = body;

  const [user] = await fetch('user', { username });
  if (!user) return new Error("User is not registered");

  const isValidPassword = await checkPassword(password, user.password);
  if (!isValidPassword) return new Error("User/Password doesn't match");

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