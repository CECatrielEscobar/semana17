import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHashed = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);

export const createAccessToken = async (payload) => {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      "secret", // la clave por la cual encripta
      {
        //opciones ej, en  cuanto tiempo experia
        expiresIn: "1d", //experia en 1 dia
      },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    );
  });
};

const objeto = {
  nombre: "catriel",
  password: "asda1234",
  email: "catrielescobar@gmail.com",
};
