var jwt = require('jsonwebtoken');

var config = require('../config');
var User = require('../db/models').User;

const AUTH_TOKEN_COOKIE = 'ravelPlatform';

function createToken(email, userId) {
  try {
    return jwt.sign({ email, userId }, config.jwtSecret, { expiresIn: '30d' });
  } catch(e) {
    console.error(e)
  }
}

async function Login(email, password) {
  const { isValid, user } = await User.validateCredentials(email, password);
  if (!isValid) {
    throw Error('Invalid login credentials')
  }
  const userId = user.id;
  const token = createToken(email, userId)
  return {
    token,
    user,
  }
}

async function Signup(email, username, password) {
  const user = await User.create(email, password, { username });
  const userId = user.id;
  const token = createToken(email, userId)
  return {
    token,
    user,
  }
}

function Validate(token) {
  try {
    var decoded = jwt.verify(token, config.jwtSecret);
    return { isValid: true, error: null, userEmail: decoded.email, userId: decoded.userId }
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