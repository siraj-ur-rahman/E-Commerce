module.exports = {
  handleAuthentication(req, res, next) {
    console.log(req.session);

    if (!req.session.UserId) {
      return res.redirect(`/signIn`);
    }

    next();
  },
};
