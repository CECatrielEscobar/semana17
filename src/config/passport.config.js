import passport from "passport";
import local from "passport-local";
import UserModel from "../schemas/registerSchema.js";
import { createHashed, validatePassword } from "../utils.js";
import { Strategy as GitHubStrategy } from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const pwNoHash = password;
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHashed(password),
          };
          if (
            email === "adminCoder@coder.com" &&
            pwNoHash === "adminCod3r123"
          ) {
            newUser.rol = "admin";
          }
          console.log(newUser, " dsp hash");
          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obtener al usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          const pwHash = validatePassword(password, user.password);
          console.log(pwHash);
          if (!user) {
            console.log("user doesn't exist");
            return done(null, false, { message: "!Email no registrado!" });
          } else if (!validatePassword(password, user.password)) {
            return done(null, false, { message: "!Password incorrecta!" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "2d2af6bc5cf7df92c495",
        clientSecret: "57e51b82fcd2245936774289dcc0f8a99b249e4a",
        callbackURL: "http://localhost:8081/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.node_id });
          if (!user) {
            let newUser = {
              first_name: profile._json.login,
              last_name: " ",
              age: 18,
              email: profile._json.node_id,
              password: " ",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
