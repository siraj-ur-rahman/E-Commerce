const { check } = require("express-validator");
const { password } = require("../../repositories/mongodbCollection");
const usersRepo = require("../../repositories/usersRepository");

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

    check("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be in a range of 4 to 20 character long"),

    check("passwordConfirmation")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20 characters")
      .custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Passwords must match");
        }
        return true;
      }),
  ],

  signInValidation: [
    check("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be in a range of 4 to 20 character long"),

    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid Email")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });

        if (!user) {
          return false;
        }

        return true;
      })
      .withMessage("Email id does not exists.")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });

        const isValid = await usersRepo.comparePassword(
          user.password,
          password
        );

        if (!isValid) {
          return false;
        }
      })
      .withMessage("invalid password"),
  ],
};
