const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const user = "durvaks";
const pass = "cFpp2i5xKbmnY1cv";

mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.aswzdbg.mongodb.net/?retryWrites=true&w=majority`, 
{ useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB ==>> ', err));