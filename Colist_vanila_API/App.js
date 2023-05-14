//#### - Database Config
require('./Config/Database');

//#### - Express Config
const express = require('express');
const App = express();
const PORT = 3333
App.listen(PORT,()=>{
    console.log("Servidor aberto na porta: "+PORT);
})

const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');

App.use(methodOverride('_method', {methods:['POST', 'GET']}));
App.use(express.json());
App.use(express.urlencoded({extended: true}));
App.use(cookieParser());
App.use(cors());

//#### - Express Access
const AccountRouter = require('./Routes/Account');

App.use("/account", AccountRouter);





