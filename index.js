require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//ejs
app.set("view engine", "ejs");
app.set("views", "views");

//Router
const urlShortener = require("./routes/urlShortener");

//
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//env
require("dotenv").config();

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.use('/api', urlShortener);


//
mongoose
  .connect(process.env.DATABASE)
  .then((result) => {
    app.listen(port, () =>
      console.log(`BD conectada || servidor en puerto ${port} || MASTER `)
    );
  })
  .catch((err) => {
    console.log((err) => console.log("Error de conexión en BD"));
  });

