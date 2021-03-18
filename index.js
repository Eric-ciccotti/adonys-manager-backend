const cors = require("cors");
const express = require("express");
const bodyparser = require("body-parser");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passport = require('passport');

const { DB, PORT } = require("./config");

//initialisation de l"application
const app = express();

//Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(passport.initialize());

require('./middlewares/passport')(passport);

//Utilisation de RouterMiddleware
app.use("/api/users", require("./routes/users"));


const startApp = async () => {
  try {
    //connection avec la database
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    success({
      message: `Successfully connecte with the Database \n ${DB}`,
      badge: true,
    });

    //start listening for the server
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Unable to connect with Database\n ${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();

