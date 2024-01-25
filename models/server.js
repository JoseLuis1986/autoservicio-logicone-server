// Servidor de Express
const express = require('express');
const http = require('http');
// const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// const Sockets = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        //Conectar DB
        dbConnection();

        // Http server
        this.server = http.createServer(this.app);

        // Configuraciones de sockets
        // this.io = socketio(this.server, { maxHttpBufferSize: 1e8, pingTimeout: 60000 });
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use(express.static(path.resolve(__dirname, '../public')));

        //CORS
        this.app.use(cors());

        //Parseo del Body
        this.app.use(express.json());


        //API ENDPOINTS
        this.app.use('/api/login', require('../router/auth'));
        this.app.use('/api/employee', require('../router/employee'));
        this.app.use('/api/payments', require('../router/payments'));
        this.app.use('/api/general', require('../router/general'));
        // this.app.use((req, res) => {
        //     res.status(404).send({ success: false, message: "Not found" })
        // })

    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    // configurarSockets() {
    //     new Sockets(this.io);
    // }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        // this.configurarSockets();

        // Inicializar Server
        this.server.listen(this.port, () => {
            console.log('Server corriendo en puerto:', this.port);
        });
    }

}


module.exports = Server;