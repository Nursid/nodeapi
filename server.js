const express = require('express');
const app = express();
const route = require('./src/routes');
const cors = require("cors");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization, Accept"
  );

  // Continue to the next middleware
  next();
});


app.use('/api', route);

app.use(cors());


app.listen(PORT, () => console.log('Example app listening on port %s!', PORT));
