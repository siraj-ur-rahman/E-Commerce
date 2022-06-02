const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const authenticationRouter = require("./Routes/admin/authenticationRouter");
const productsRouter = require("./Routes/admin/productsRouter");
const cookieSession = require("cookie-session");

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["Hello World"] }));

app.use(authenticationRouter)
app.use(productsRouter)

const port = 3000;
app.listen(port, () => {
  console.log(`Listinge on port: ${port}`);
});
