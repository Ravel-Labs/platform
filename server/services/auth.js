var jwt = require('jsonwebtoken');
var config = require('../config')

const AUTH_TOKEN_COOKIE = 'ravelPlatform';

function createToken(email) {
  try {
    return jwt.sign({ email }, config.jwtSecret, { expiresIn: '30d' });
  } catch(e) {
    console.error(e)
  }
}

async function Login(email, password) {
  // TODO: lookup user in DB by email.
  // TODO: validate password
  const token = createToken(email)
  return {
    token,
    user: {
      email,
      username: "todo_username",
      id: 12,
      displayName: "Display Name",
    },
  }
}

async function Signup(email, username, password) {
  // TODO: validate uniqueness & proper values.
  // TODO: create user in DB.
  const token = createToken(email)
  return {
    token,
    user: {
      email,
      username,
      id: 12,
      displayName: "Display Name",
    },
  }
}

function Validate(token) {
  try {
    var decoded = jwt.verify(token, config.jwtSecret);
    return { isValid: true, error: null, userEmail: decoded.email }
  } catch(err) {
    return { isValid: false, error: err }
  }
}

module.exports = {
  Login,
  Signup,
  Validate,
  AUTH_TOKEN_COOKIE,
};