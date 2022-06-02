const express = require("express");
const multer = require("multer");

const usersRepo = require("../../repositories/usersRepository");
const signupTemplate = require("../../views/admin/authentication/signup");
const signinTemplate = require("../../views/admin/authentication/signin");
const { handleErrors } = require("./errorMiddleware");
const { signUpValidation, signInValidation } = require("./validators");

const router = express.Router();
upload = multer({ storage: multer.memoryStorage() });

router.get("/signUp", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signUp",
  signUpValidation,
  upload.single("profilePhoto"),
  handleErrors(signupTemplate),
  async (req, res) => {
    // const image = req.file.buffer.toString("base64");

    const { email, password } = req.body;

    const dbUser = { email: email, password: password };

    const user = await usersRepo.create(dbUser);

    req.session.UserId = user.id;

    res.redirect(`/admin/products`);
  }
);

router.get("/signout", async (req, res) => {
  req.session = null;

  res.send(`You are logout`);
});

router.get("/signIn", async (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signIn",
  signInValidation,
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.UserId = user.id;

    res.send("Account Signed In");
  }
);

module.exports = router;
