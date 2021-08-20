const crypto = require("crypto");
var bcrypt = require('bcrypt');

exports.generateToken = (size = 20) => crypto.randomBytes(size).toString('hex');

exports.validateEmail = (email) => {
  const re = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+/g;
  return re.test(String(email).toLowerCase());
}

exports.responseTreatment = (object, res, next, genericError = "Can't access this element") => {
  if (object) {
    if (object instanceof Error) next(object)
    else res.status(201).send(object)
  }
  else next(new Error(genericError));
}


exports.cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash;
}

exports.checkPassword = (password, hash) => bcrypt.compare(password, hash)