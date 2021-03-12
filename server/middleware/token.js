var AuthService = require("../services/auth");

function requireUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE];
  const { isValid, userEmail, userId } = AuthService.Validate(authToken);
  if (!isValid) {
    res.status(401).send("Access denied: invalid token");
  }
  req.userEmail = userEmail;
  req.userId = userId;
  console.log("userId: ", req.userId);
  next();
}

function withUser(req, res, next) {
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE];
  const { userEmail, userId } = AuthService.Validate(authToken);
  req.userEmail = userEmail;
  req.userId = userId;
  next();
}

module.exports = {
  requireUser,
  withUser,
};
