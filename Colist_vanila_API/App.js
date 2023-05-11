//#### - Database Config
require('./Config/Database');

//#### - Express Config
const express = require('express');
const App = express();
App.listen(3333,()=>{
    console.log("Servidor aberto");
})

const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

App.use(methodOverride('_method', {methods:['POST', 'GET']}));
App.use(express.json());
App.use(express.urlencoded({extended: true}));
App.use(cookieParser());

//#### - Express Access
const AccountRouter = require('./Routes/Account');

App.use("/account", AccountRouter);





