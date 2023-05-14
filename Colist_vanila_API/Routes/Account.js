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

//#### Login Account
AccountRouter.post("/login", async (req, res) => {
    const { user, password } = req.body;
    try {
      const userFind = await Account.findOne({ user });
      console.log(userFind._id.toString())
      if (userFind.password === password) {
        // Envia uma resposta JSON para o cliente informando que o login foi bem sucedido
        const loginDate = new Date()
        res.status(200).json({
             message: "Login bem sucedido",
             login_date: loginDate,
             login_access: userFind._id.toString()
            });
      } else {
        // Envia uma resposta de erro se as credenciais estiverem incorretas
        res.status(401).json({ message: "Usuário ou senha inválidos" });
      }
    } catch (error) {
      // Envia uma resposta de erro caso ocorra algum problema durante a consulta ao banco de dados
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

//#### Authenticate Account
AccountRouter.get("/authenticate/:id", async (require, response) => {
    const idUser = require.params.id;
    try {
        let finded = await Account.findById(idUser);
        if (finded) {
            response.json({
                Logged: true,
                data_list: finded.database || null
            })
        } else {
            response.json({status: 'usuario nao encontrado'})
        }
    } catch (error) {
        response.json({error})
    }
})

//#### set changes
AccountRouter.put('/change', async (req, res)=>{
    let userID = req.body.id;
    let newData = req.body.data;
    try{
        const accountchanged = await Account.findByIdAndUpdate(userID, {database: newData})
        res.json({accountchanged});
    }catch(error){
        res.json({error});
    }
})


//#### Return Accounts
AccountRouter.get("/all", async (req, res)=>{
    let find = await Account.find({})
    res.send(find);
})

module.exports = AccountRouter;
