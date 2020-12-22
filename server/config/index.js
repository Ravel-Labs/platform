const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  databaseURL: process.env.DATABASE_URI,
  frontendUrl: process.env.FRONT_URL || "https://www.ravelmusic.io",
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
}