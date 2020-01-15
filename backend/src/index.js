require('dotenv/config');

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(process.env.PORT || 3333);
