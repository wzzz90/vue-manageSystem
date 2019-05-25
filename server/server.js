const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const port = process.env.PORT || 5000;
const app = new express();

// 引入users.js
const users = require("./routes/apis/users.js");

// profile.js
const profiles = require("./routes/apis/profiles.js");
/* db.config */
const db = require("./config/key.js").mongoURI;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* connect to db */
mongoose.connect(db)
  .then(() => console.log("mongooose connected"))
  .catch(error => console.log(error))

/* passport初始化 */
app.use(passport.initialize());
require("./config/passport")(passport);

app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(port, () => {
  console.log(`server running at ${port}`);
})