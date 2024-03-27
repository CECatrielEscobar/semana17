import jwt from "jsonwebtoken";
import config from "../../config.js";
import { compareSync } from "bcrypt";
export const current = (req, res) => {
  if (req.user) {
    res.send({
      message: "Token correcto",
      user: {
        name: req.user.first_name,
        lastname: req.user.last_name,
        email: req.user.email,
      },
    });
  } else {
  }
};

export const checkSession = (req, res) => {
  if (req.user) {
    return res.send({
      message: true,
      data: {
        email: req.user?.email,
        nombre: req.user?.first_name,
        apellido: req.user.last_name,
      },
    });
  }
  return res.send({
    message: false,
  });
};

export const validateRegister = async (req, res) => {
  if (req.user.email) {
    return res.send({ message: "Cuenta creada" });
  } else {
    return res.send({ message: "email registrado" });
  }
};

export const checkRegister = (req, res) => {
  if (req.user.email) {
    res.redirect("/product/products");
  }
  res.render("register");
};

export const validateLogin = async (req, res) => {
  console.log(req.user);
  let token = jwt.sign(
    {
      id: req.user._id,
      name: req.user.first_name,
      last_name: req.user.last_name,
    },
    config.secretJWT,
    {
      expiresIn: "1h",
    }
  );
  console.log("este es mi token", token);
  res.cookie("jwt", token, {
    signed: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });
  const { email, password } = req.body;
  try {
    const response = await userDAO.loginUser(email, password);
    console.log("estoy en login", compareSync(password, response.password));
    if (!response) {
      res.status(401).send({
        status: false,
        message: "!Email no registrado!",
      });
    } else if (!compareSync(password, response.password)) {
      res.status(401).send({
        status: false,
        message: "!Password incorrecta!",
      });
    } else {
      res.send({
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkLogin = (req, res) => {
  if (req.user) {
    res.redirect("/product/products");
  }
  res.render("login");
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  req.session.destroy((err) => {
    console.log(req.session, " hola soy session logout");
    if (!err) res.redirect("/session/login");
    else res.redirect("/session/login");
  });
};
