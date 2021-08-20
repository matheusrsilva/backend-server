const crypto = require("crypto");

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