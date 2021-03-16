var AuthService = require("../services/auth");

function requireUser(req, res, next) {
  console.log("found cookie", req.cookies[AuthService.AUTH_TOKEN_COOKIE]);
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE];
  const { isValid, userEmail, userId } = AuthService.Validate(authToken);
  console.log("token info isValid ", isValid, "userEmail: ", userEmail);
  if (!isValid) {
    res.status(401).send("Access denied: invalid token");
  }
  req.userEmail = userEmail;
  req.userId = userId;
  next();
}

function withUser(req, res, next) {
  console.log("found cookie", req.cookies[AuthService.AUTH_TOKEN_COOKIE]);
  const authToken = req.cookies[AuthService.AUTH_TOKEN_COOKIE];
  const { userEmail, userId } = AuthService.Validate(authToken);
  console.log("token info userEmail: ", userEmail);
  req.userEmail = userEmail;
  req.userId = userId;
  next();
}

module.exports = {
  requireUser,
  withUser,
};
