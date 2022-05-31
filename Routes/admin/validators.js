const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  signUpValidation: [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid Email")
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });

        if (existingUser) {
          throw new Error("Email in use");
        }
      }),

    check("password").isLength({ min: 4, max: 20 }),

    check("confirmationPassword")
      .isLength({ min: 4, max: 20 })
      .custom((confirmationPassword, { req }) => {
        if (confirmationPassword !== req.body.password) {
          throw new Error("Passwords must match");
        }
      }),
  ],

  signInValidation: [
    check("password").isLength({ min: 4, max: 20 }),

    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid Email")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });

        if (!user) {
          throw new Error("Email id does not exists.");
        }

        const isValid = await usersRepo.comparePassword(
          user.password,
          password
        );

        if (!isValid) {
          throw new Error("invalid password");
        }
      })
  ],
};
