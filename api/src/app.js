const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const productRouter = require('./routes/productRouter.js');
const userRouter = require('./routes/userRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const login = require("./middlewares/login.js");
const admin = require("./middlewares/admin.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

//routes
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);

app.get("/authorization", login, admin, (req, res)=>{
  res.json({message: "authorized"});
})

// Error catching endware.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = app;
