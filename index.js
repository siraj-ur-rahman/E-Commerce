const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const authRouter = require("./Routes/admin/auth");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["Hello World"] }));
app.use(authRouter)

const port = 3000;
app.listen(port, () => {
  console.log(`Listinge on port: ${port}`);
});
