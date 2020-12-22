var AuthService = require('../services/auth');

function requireUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE]
  const { isValid, userEmail } = AuthService.Validate(authToken);
  if (!isValid) {
    res.status(401).send('Access denied: invalid token');
  }
  req.userEmail = userEmail
  next()
}

function withUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE]
  const { userEmail } = AuthService.Validate(authToken);
  req.userEmail = userEmail;
  next()
}

module.exports = {
  requireUser,
  withUser,
}