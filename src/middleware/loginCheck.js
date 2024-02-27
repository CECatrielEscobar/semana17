export const loginCheck = (req, res, next) => {
  if (req.session.email) {
    return next();
  } else {
    res.redirect("/session/login");
  }
};
