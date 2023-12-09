const axios = require('axios');
const FormData = require('form-data');
const { response } = require('express');
const user = require('../models/user');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { validate } = require('../models/user');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


const createUser = async (req, res = response) => {
    console.log(req.body);
    const {
        tenant_id,
        client_id,
        client_secret,
        grant_type,
        resource } = req.body;

    let data = new FormData();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', `${client_id}`);
    data.append('client_secret', `${client_secret}`);
    data.append('resource', `${resource}`);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://login.microsoftonline.com/${tenant_id}/oauth2/token`,
        headers: {
            'Cookie': 'fpc=AhRd1HaGq51PoupPS4_VfPm_VOVHAQAAAEDdA90OAAAA',
            ...data.getHeaders()
        },
        data: data
    };

    axios.request(config)
        .then((response) => response.data)
        .then((result) => {
            const { access_token } = result;
            console.log('token', access_token);
            if (access_token) {
                res.json({
                    ok: true,
                    token: access_token
                })
            }

        })
        .catch((error) => {
            console.log('error de register', error.data);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        });

    // const { tenant_id, client_id, client_secret, grant_type, resource } = req.body;

    //verificar que el email no exista
    // const emailExists = await User.findOne({ email: email });

    // if (emailExists) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El correo ya existe'
    //     })
    // }

    // const usuario = new User(req.body);
    // //Encriptar contraseña
    // const salt = bcrypt.genSaltSync();
    // usuario.password = bcrypt.hashSync(password, salt);

    // //Guardar usuario en BD
    // await usuario.save();

    // // Generar el JWT

    // const token = await generateJWT(usuario.id);

    // res.json({
    //     ok: true,
    //     usuario,
    //     token
    // })



};

const loginUser = async (req, res = response) => {

    console.log('mi data', req.body);

    const token = req.headers['authorization'];

    const { Personnelnumber, Identification, Nombre } = req.body;

    const url = 'https://usnconeboxax1aos.cloud.onebox.dynamics.com/api/services/LHKioskoServiceGroup/LHKioskoService/GetLHEmployeeInformation';


    let rawData = JSON.stringify({ _json: `{\"Personnelnumber\":\"${Personnelnumber}\",\"Identification\":\"${Identification}\",\"Nombre\":\"${Nombre}\"}` })

    try {
        const resp = await axios.post(url, rawData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        })
        const result = await resp.data;
        res.status(200).json({
            ok: true,
            uid: '15154',
            usuario: result
        })
    } catch (error) {
        return res.status(404).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    console.log(rawData);

    // res.json({
    //     ok: true,
    //     uid: '15154',
    // })
    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://usnconeboxax1aos.cloud.onebox.dynamics.com/api/services/LHKioskoServiceGroup/LHKioskoService/GetLHEmployeeInformation',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `${token}`
    //     },
    //     data: rawData
    // };

    // axios.request(config)
    //     .then((response) => {
    //         return res.json({
    //             ok: true,
    //             uid: '15154',
    //             usuario: JSON.stringify(response.data)
    //         })
    //     })
    //     .catch((error) => {
    //         return res.status('404').json({
    //             ok: false,
    //             msg: 'Hable con el administrador'
    //         })
    //     });
    // res.json({
    //     ok: true,
    //     usuario: email,
    //     token: password
    // })

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
        const token = await generateJWT(uid);

        //Obtener el usuario por uid
        const usuario = await User.findById(uid);

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