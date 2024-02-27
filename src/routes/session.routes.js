import { Router } from "express";
const router = Router();
import UserDAO from "../DAO/userDAO.js";
const userDAO = new UserDAO();

router.get("/login", (req, res) => {
  if (req.session.email) {
    res.redirect("/product/products");
  }
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    res.send({
      message: "Todos los campos son requeridos",
    });
  }
  try {
    const response = await userDAO.loginUser(email, password);
    if (!response) {
      res.status(404).send({
        status: false,
        message: "!Email no registrado!",
      });
    } else if (response.password !== password) {
      res.status(404).send({
        status: false,
        message: "!Password incorrecta!",
      });
    } else {
      req.session.first_name = response.first_name;
      req.session.last_name = response.last_name;
      req.session.email = response.email;
      console.log(req.session);
      console.log("logueado hacer redirect");
      res.send({
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/register", async (req, res) => {
  res.render("register");
  console.log(req.session);
  if (req.session.email) {
    return res.redirect("/product/products");
  }
});

router.post("/register", async (req, res) => {
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
  try {
    const response = await userDAO.registerUser(data);
    if (!response) {
      res.send({ message: "email registrado" });
      return;
    } else {
      console.log("registrado");
      return res.send({ message: "Cuenta creada" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/session", (req, res) => {
  console.log(req.session.email, "desde /session");
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
  req.session.destroy((err) => {
    if (!err) res.redirect("/session/login");
    else res.redirect("/session/login");
  });
});

export default router;
