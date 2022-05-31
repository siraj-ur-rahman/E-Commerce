const express = require("express");
const { validationResult } = require("express-validator");
const usersRepo = require("../../repositories/users");
const router = express.Router();
const signupTemplate = require("../../views/admin/signup");
const signinTemplate = require("../../views/admin/signin");
const { signUpValidation, signInValidation } = require("../admin/validators");

router.get("/signUp", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post("/signUp", signUpValidation, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send(signupTemplate({ req, errors }));
  }

  const { email, password } = req.body;

  const dbUser = { email: email, password: password };

  const user = await usersRepo.create(dbUser);

  req.session.UserId = user.id;

  res.send(`Account Created, your Id is ${user.id}`);
});

router.get("/signout", async (req, res) => {
  req.session = null;

  res.send(`You are logout`);
});

router.get("/signIn", async (req, res) => {
  res.send(signinTemplate());
});

router.post("/signIn", signInValidation, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.send(signinTemplate({ errors }));
  }

  const { email } = req.body;

  const user = await usersRepo.getOneBy({ email });

  req.session.UserId = user.id;

  res.send("Account Signed In");
});

module.exports = router;
