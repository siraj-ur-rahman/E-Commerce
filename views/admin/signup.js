const layout = require("../layout");

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return "";
  }
};

module.exports = ({ req, errors }) => {
  return layout({
    content: `
    <div>
    ${req.session.UserId ? "Your Id is" + req.session.UserId : ""}
    <form method="POST">
        <input name ="email"  placeholder="Name"/>
        ${getError(errors, "email")}
        <input name ="password"  placeholder="password"/>
        ${getError(errors, "password")}

        <input name ="confirmationPassword"  placeholder="password"/>
        ${getError(errors, "confirmationPassword")}

        <button>Sign Up</button>
    </form>
  </div>
    `,
  });
};
