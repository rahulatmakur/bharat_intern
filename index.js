const express = require("express");
const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
dotenv.config();
const port = process.env.port || 8080;

const password = process.env.MONGODB_PASSWORD;
const username = process.env.MONGODB_USERNAME;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.imtkvuc.mongodb.net/registrationdb`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const registration = mongoose.model("registrastion", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existinguser = await registration.findOne({ email: email });
    if (!existinguser) {
      const registrastionData = new registration({
        name,
        email,
        password,
      });
      await registrastionData.save();
      res.redirect("/success");
    } else {
      alert("user already exitis");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});
