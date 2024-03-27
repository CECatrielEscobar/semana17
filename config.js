import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  secretSession: process.env.SECRET_SESSION,
  secretCookie: process.env.SECRET_COOKIE,
  secretJWT: process.env.SECRET_JWT,
};
