const mongoose = require('mongoose')

const AccountSchema = mongoose.Schema({
    user:{type: String, require: true, unique: true},
    password:{type: String, require: true},
    email:{
        type: String,
        require: true,
        validate: {
            validator: function (value) {
              // Verifica se o valor é um endereço de e-mail válido
              return /\S+@\S+\.\S+/.test(value);
            },
            message: props => `${props.value} não é um endereço de e-mail válido!`
          },
        unique: true
     },
    database:{type: String}
})


module.exports = mongoose.model('Account', AccountSchema);