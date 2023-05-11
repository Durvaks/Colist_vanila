const express = require('express');
const Account = require('../models/Account');
const AccountRouter = express.Router();

//#### Create Account
AccountRouter.post("/new", async (req, res)=>{
    let {user, password, email} = req.body
    const newUser = new Account({user, password, email})
    try{
        await newUser.save()
        res.send("Registrado")
    }catch(error){
        res.send(`Registro não autorizado: \n Destrição do Erro: ${error}`)
    }
})

//#### Authenticate Account
AccountRouter.get("/authenticate/:id", async (require, response) => {
    const idUser = require.params.id;
    response.setHeader('Access-Control-Allow-Origin', '*');
    try {
        let finded = await User.findById(idUser);
        if (finded) {
            response.json({Logged: true})
        } else {
            response.json({Logged: false})
        }
    } catch (error) {
        response.json({Logged: false})
    }
})

//#### Return Accounts
AccountRouter.get("/all", async (req, res)=>{
    let find = await Account.find({})
    res.send(find);
})

module.exports = AccountRouter;
