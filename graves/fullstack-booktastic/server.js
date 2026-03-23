const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));

mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(
      '============================{ connected to mongoose }============================'
    );
  }
);

const indexRouter = require('./routes/index_route');
const authorRouter = require('./routes/authors_route');

app.use('/', indexRouter);
app.use('/authors', authorRouter);

app.listen(process.env.PORT, () => {
  console.log(`=================={ server created at port ${process.env.PORT} }==================`);
});
