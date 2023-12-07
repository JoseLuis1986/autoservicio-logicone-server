const { response } = require('express');
const user = require('../models/user');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { validate } = require('../models/user');



const createUser = async (req, res = response) => {
    try {

        const { email, password } = req.body;

        //verificar que el email no exista
        const emailExists = await User.findOne({ email: email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new User(req.body);
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario en BD
        await usuario.save();

        // Generar el JWT

        const token = await generateJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

const loginUser = async (req, res = response) => {

    // const body = req.body;
    const { email, password } = req.body;

    res.json({
        ok: true,
        usuario: email,
        token: password
    })

    // try {
    //     // Verificar si existe el correo
    //     const userDb = await User.findOne({ email });
    //     if( !userDb ){
    //         return res.status(404).json({
    //             ok: false,
    //             msg: 'Email no encontrado'
    //         });
    //     }

    //     //Validar el password
    //     const validPassword = bcrypt.compareSync( password, userDb.password );
    //     if( !validPassword ){
    //         return res.status(400).json({
    //             ok: false,
    //             msg: 'Password no es correcto'
    //         });
    //     }

    //     //Generar el JWT
    //     const token = await generateJWT( userDb.id );

    //     res.json({
    //         ok: true,
    //         usuario: userDb,
    //         token
    //     })

    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Hable con el administrador'
    //     })
    // }
};


const renewToken = async (req, res = response) => {

    const uid = req.uid;

    try {
        // Generar un nuevo jwt
        const token = await generateJWT( uid );
    
        //Obtener el usuario por uid
        const usuario = await User.findById( uid );
    
        res.json({
            ok: true,
            usuario,
            token
        })
        
    } catch (err) {
        console.log(err)
    }
};

module.exports = {
    createUser,
    loginUser,
    renewToken
};