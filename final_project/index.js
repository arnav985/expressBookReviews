const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer", resave:true, saveUninitialized:true}));

// simple placeholder auth middleware (you can implement JWT later)
app.use("/customer/auth/*", (req,res,next) => {
  next();
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
