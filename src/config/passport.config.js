import passport from "passport";
import local from "passport-local";
import UserModel from "../schemas/registerSchema.js";
import { createAccessToken, createHashed, validatePassword } from "../utils.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy } from "passport-jwt";
import config from "../../config.js";

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
            return done(null, false, { message: "email registrado" });
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
          let result = await UserModel.create(newUser);
          if (result) {
            const user = {
              first_name: result.first_name,
              last_name: result.last_name,
              email: result.email,
            };
            // console.log(user);
            // const token = await createAccessToken(user);
            // res.clearCookie("token");
            // res.cookie("token", token, { signed: true });

            return done(null, result);
          }
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
    "jwt",
    new Strategy(
      {
        // jwtFromRequest: función que recibe el objeto request y como resultado
        // debe devolver el token a passport. Esto passport-jwt lo pide ya que solo
        // el desarrollador es quien sabe como se manda el jwt (puede enviarse, en las
        // cookies, distintas cabeceras, en el body, como un url param, etc.)
        jwtFromRequest: (req) => {
          var token = null;
          if (req && req.signedCookies) {
            token = req.signedCookies["jwt"];
          }
          return token;
        },

        // secretOrKey: Nos lo pide pada poder verificar la firma del JWT (claramente
        // tiene que tener el mismo valor que el secret que usamos para firmar el JWT
        // en la libreria jsonwebtoken)
        secretOrKey: config.secretJWT,
      },
      async function (jwt_payload, done) {
        // jwt_payload representa el objeto json que guardamos dentro del JWT
        let userId = jwt_payload.id;
        let user = await UserModel.findById(userId);

        // La funcion done(error, valor) sirve para indicar la salida de passport en donde
        // error puede contener un objeto representando un error o ser null en caso que no haya,
        // y valor es lo que vamos a poder acceder en nuestras funciones de rutas como req.user.
        // En caso de que las crendeciales no sean válidas se debe devolver un done(null, false)
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
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
