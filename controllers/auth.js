const axios = require('axios');
const FormData = require('form-data');
const { response } = require('express');
const Configuration = require('../models/configuration');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { validate } = require('../models/user');
const { getToken, sendMail } = require('../service/index');
const generateRandomNumbers = require('../helpers/generateRandomNumbers');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getConfigurations = async (req, res = response) => {
    try {
        const configurations = await Configuration.find();
        //Si hay una configuracion establecida se retorna el token
        if (configurations[0]) {
            const result = await getToken(configurations[0])
            const { token } = result;
            res.status(200).json({
                success: true,
                token
            })
        } else {
            // De lo contrario se retorna un mensaje
            res.status(200).json({
                success: false,
                result: "no hay configuracion inicial"
            })
        }
    } catch (err) {
        console.log("hubo un error")
    }
}

const createConf = async (req, res = response) => {
    try {
        const respuesta = await getToken(req.body);
        if (respuesta.success) {
            const conf = new Configuration(req.body);
            await conf.save();
            res.status(201).json(respuesta)
        }

    } catch (error) {
        res.status(400).json(error)
    }
};

const loginUser = async (req, res = response) => {

    const token = req.headers['authorization'];

    const { Personnelnumber, Identification, Nombre } = req.body;

    const url = process.env.URL_GET_EMPLOYEE;


    let rawData = JSON.stringify({ _json: `{\"Personnelnumber\":\"${Personnelnumber}\",\"Identification\":\"${Identification}\",\"Nombre\":\"${Nombre}\"}` })
    
    try {
        const resp = await axios.post(url, rawData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        })
        const { data } = resp;
        const dataUser = JSON.parse(data);
        const { Received, CodigoError, DescripcionError } = dataUser;
        const datosUser = JSON.parse(Received);
        const fourDigits = generateRandomNumbers();
        const subject = `Bienvenido al autoservicio de logicone Sr. ${datosUser.Name}, ${datosUser.PrimaryContactEmail}`

        await sendMail(`${subject}`, "joseluissanchezgarcia1986@gmail.com", "Su clave de acceso", fourDigits)
        const dtt = {
            datosUser,
            CodigoError,
            DescripcionError,
            ClaveAccess: fourDigits
        }
        res.status(200).json({
            success: true,
            usuario: dtt
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            error: err
        })
    }
};

const renewToken = async (req, res = response) => {
    const name = req.query;

    res.status(200).json({ ok: true })
};

module.exports = {
    getConfigurations,
    createConf,
    loginUser,
    renewToken
};