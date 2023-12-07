const mongoose = require('mongoose');


const dbConnection = async() => {

    try {

        mongoose.connect(process.env.BD_CNN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Db Online");
        
    } catch (error) {
        console.log("imprime este error", error);
        throw new Error('Error en la base de datos - vea logs');
    }
}

module.exports = {
    dbConnection
}