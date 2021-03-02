var AuthService = require('../services/auth');

function requireUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE]
  const { isValid, userEmail, userId } = AuthService.Validate(authToken);
  if (!isValid) {
    res.status(401).send('Access denied: invalid token');
  }
  req.userEmail = userEmail;
  req.body.userId = userId;
  next()
}

function withUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE]
  const { userEmail, userId } = AuthService.Validate(authToken);
  req.userEmail = userEmail;
  req.body.userId = userId;
  next()
}

function requireAccess(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE];
  const { isValid, userEmail, userId } = AuthService.Validate(authToken);
  if (!isValid) {
    res.status(401).send('Access denied: invalid token');
  }
  const hasAccess = AuthService.validateAccess(userId, req.params.slug);
  if (!hasAccess) {
    res.status(401).send('Access denied: user does not have access');
  }
  req.userEmail = userEmail;
  req.body.userId = userId;
  next()
}

module.exports = {
  requireUser,
  withUser,
  requireAccess,
}