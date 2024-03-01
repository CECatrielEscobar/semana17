import { Router } from "express";
const router = Router();
import UserDAO from "../DAO/userDAO.js";
import { createHashed } from "../utils.js";
import { compareSync } from "bcrypt";
import passport from "passport";
const userDAO = new UserDAO();

router.get("/login", (req, res) => {
  if (req.session.email) {
    res.redirect("/product/products");
  }
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const response = await userDAO.loginUser(email, password);
      console.log(response);
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
        req.session.first_name = response.first_name;
        req.session.last_name = response.last_name;
        req.session.email = response.email;
        res.send({
          status: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/register",

  async (req, res) => {
    res.render("register");
  }
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/login" }),
  async (req, res) => {
    const data = req.body;

    if (
      !data.first_name ||
      !data.last_name ||
      !data.email ||
      !data.age ||
      !data.password
    ) {
      return res.status(404).send({
        message: "Todos los campos son requeridos",
      });
    }
    if (
      data.email == "adminCoder@coder.com" &&
      data.password == "adminCod3r123"
    ) {
      data.rol = "admin";
    }
    data.rol = "usuario";
    data.password = createHashed(data.password);
    console.log(data.password);
    try {
      const response = await userDAO.registerUser(data);
      if (!response) {
        res.send({ message: "email registrado" });
        return;
      } else {
        return res.send({ message: "Cuenta creada" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/session", (req, res) => {
  if (req.session.email) {
    return res.send({
      message: true,
      data: {
        email: req.session.email,
        nombre: req.session.first_name,
        apellido: req.session.last_name,
      },
    });
  }
  return res.send({
    message: false,
  });
});

router.get("/logout", (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    console.log(req.session, " hola soy session logout");
    if (!err) res.redirect("/session/login");
    else res.redirect("/session/login");
  });
});

export default router;
