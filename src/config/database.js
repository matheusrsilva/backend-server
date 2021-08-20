const moment = require('moment');

const database = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'pastebin'
  }
});
exports.database = database;

const fetch = async (table ,fields) => database(table).where(fields);
exports.fetch = fetch;

const update = async (table , fields, id) => database(table).where('id', id).update(fields);
exports.update = update;

const getValidToken = async (token) => {
  if (!token) return (new Error('Invalid Token'));
  const [foundToken] = await fetch('token', { token });
  if (!foundToken) return (new Error('Invalid Token'));
  if (moment(foundToken.expiration, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())) {
    return (new Error('Token is Expired. Login to get a new'));
  }
  return foundToken;
};
exports.getValidToken = getValidToken;