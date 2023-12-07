const { userConnected,
        userDisconnect,
        getUsers, 
        saveMessage,
        saveNote,
        saveUrl,
        getNotes,
    } = require("../controllers/sockets");
const { proveJWT } = require("../helpers/jwt");


class Sockets {

    constructor(io) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async (socket) => {

            const [valido, uid] = proveJWT(socket.handshake.query['x-token']);
            console.log("cliente conectado", uid);


            if (!valido) {
                console.log('socket no identificado');
                return socket.disconnect();
            }

            await userConnected(uid);
            // const userOnline = await userConnected( uid );

            // console.log('se conecto', userOnline.name);

            //Unir al usuario a una sala de socket.io
            socket.join( uid );

            //TODO: Validar el JWT
            //Si el token no es valido, desconectar

            //TODO: Saber que usuario esta activo mediante UID

            //TODO: Emitir todos los usuario conectados
            this.io.emit('list-users', await getUsers());

            //TODO: Socket join, uid


            //TODO: Escuchar cuando el cliente manda un mensaje
            socket.on('personal-message', async( payload ) => {
                const msg = await saveMessage( payload );
                this.io.to( payload.to ).emit('personal-message', msg);
                this.io.to( payload.from ).emit('personal-message', msg);
            })

            //Escuchar cuando el cliente crea un nuevo ticket
            socket.on('solicitar-ticket', async( payload ) => {

                const{ from, department, title, body, level, url } = payload;

                if( url ){
                    const { secure_url } = await saveUrl(payload.url);
                    const data = { from, department, title, body, level, url: secure_url };  
                    const msg = await saveNote( data );
                }else {
                    const data1 = { from, department, title, body, level };  
                    const msg = await saveNote( data1 );
                }
                
                //emitir todos los mensajes realizados
                this.io.emit('list-notes', await getNotes());
            })
            
            this.io.emit('list-notes', await getNotes());

            //TODO: Disconnect
            //Marcar en la BD que el usuario se desconecto
            //TODO: Emitir todos los usuarios conectados

            socket.on('disconnect', async () => {
                console.log("cliente desconectado", uid);
                await userDisconnect(uid);
                this.io.emit('list-users', await getUsers());
            })


        });
    }


}


module.exports = Sockets;