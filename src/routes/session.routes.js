import { Router } from "express";
import UserDAO from "../DAO/userDAO.js";
import passport from "passport";

const router = Router();

import {
  checkLogin,
  checkRegister,
  checkSession,
  current,
  logout,
  validateLogin,
  validateRegister,
} from "../controllers/session.controller.js";
const userDAO = new UserDAO();

router.get("/login", checkLogin);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  validateLogin
);

router.get("/register", checkRegister);

router.post("/register", passport.authenticate("register"), validateRegister);

router.get("/session", checkSession);

router.get("/logout", logout);

router.get("/current", passport.authenticate("jwt"), current);

export default router;
