const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

module.exports = {
  // AWS
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsAccessKeySecret: process.env.AWS_ACCESS_KEY_SECRET,
  awsRegion: "us-west-1",
  awsS3BucketName: "ravel-platform-dev",
  // DB
  databaseURLDev: process.env.DATABASE_URL_DEV,
  databaseURLTest: process.env.DATABASE_URL_LOCAL_TEST,
  databaseURLProd: process.env.DATABASE_URL,
  // Other
  frontendUrl: process.env.FRONT_URL || "https://www.ravelmusic.io",
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  adminPassword: process.env.ADMIN_PASSWORD,
};
