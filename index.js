const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
  res.send(`
  <div>
    <form method="POST">
        <input name ="email"  placeholder="Name"/>
        <input name ="password"  placeholder="password"/>
        <input name ="confirmationPassword"  placeholder="password"/>
        <button>Sign Up</button>
    </form>
  </div>
  `);
});

app.post("/", (req, res) => {
  console.log(req.body);

  res.send("Account Created");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listinge on port: ${port}`);
});
