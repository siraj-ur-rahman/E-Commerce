module.exports = {
  handleAuthentication(req, res, next) {
    if (!req.session.UserId) {
      return res.redirect(`/signIn`);
    }

    next();
  },
};
