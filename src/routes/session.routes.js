import { Router } from "express";
const router = Router();
import UserDAO from "../DAO/userDAO.js";
import { createHashed } from "../utils.js";
import { compareSync } from "bcrypt";
import passport from "passport";
import UserModel from "../schemas/registerSchema.js";
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

router.get("/register", async (req, res) => {
  if (req.session.email) {
    res.redirect("/product/products");
  }
  res.render("register");
});

router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    console.log(req.user, " USUARIO REGISTER");

    if (req.user.email) {
      return res.send({ message: "Cuenta creada" });
    } else if (req.user.userFind) {
      return res.send({ message: "email registrado" });
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
