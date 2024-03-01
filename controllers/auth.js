const axios = require('axios');
const fs = require('fs');
const { response } = require('express');
const Configuration = require('../models/configuration');
const { getToken, sendMail } = require('../service/index');
const generateRandomNumbers = require('../helpers/generateRandomNumbers');
const { sendRequestAccess } = require('../service/employee.service');
const bcrypt = require('bcryptjs');
const UserAdmin = require('../models/useradmin');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const getConfigurations = async (req, res = response) => {
    try {
        const configurations = await Configuration.find();

        //Si hay una configuracion establecida se retorna el token
        if (configurations[0]) {
            const result = await getToken(configurations[0]);
            const { logo, background } = configurations[0];
            const { token } = result;
            if (logo === null && background === null) {
                return res.status(200).json({
                    success: true,
                    token,
                })
            }
            if (logo && background === null) {
                const imageLogo = fs.readFileSync(logo, { encoding: 'base64' });
                return res.status(200).json({
                    success: true,
                    token,
                    imageLogo
                })
            } if (background && logo === null) {
                const backgroundImage = fs.readFileSync(background, { encoding: 'base64' });
                return res.status(200).json({
                    success: true,
                    token,
                    backgroundImage
                })
            } else {
                const imageLogo = fs.readFileSync(logo, { encoding: 'base64' });
                const backgroundImage = fs.readFileSync(background, { encoding: 'base64' });
                return res.status(200).json({
                    success: true,
                    token,
                    imageLogo,
                    backgroundImage
                })
            }

        } else {
            // De lo contrario se retorna un mensaje
            res.status(200).json({
                success: false,
                result: "no hay configuracion inicial"
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const createConf = async (req, res = response) => {
    const logo = req.files.logo && req.files.logo[0];
    const background = req.files.background && req.files.background[0];

    try {
        const respuesta = await getToken(req.body);

        if (respuesta.success) {
            //si hay background y logo
            // const { password } = req.body;
            // const passwordHashed = bcrypt.hashSync(password, 10);

            if (logo != undefined && background != undefined) {
                const conf = new Configuration({
                    ...req.body,
                    logo: './uploads/logo/' + logo.filename,
                    background: './uploads/background/' + background.filename
                });

                const resultado = await conf.save();
                const imageLogo = fs.readFileSync(resultado.logo, { encoding: 'base64' });
                const backgroundImage = fs.readFileSync(resultado.background, { encoding: 'base64' });

                return res.status(201).json({ ...respuesta, imageLogo, backgroundImage })

                // si hay logo pero no hay background
            } if (logo != undefined && background === undefined) {
                delete req.body['background'];
                const conf = new Configuration({
                    ...req.body,
                    // password: passwordHashed,
                    logo: './uploads/logo/' + logo.filename
                });

                const resultado = await conf.save();
                const imageLogo = fs.readFileSync(resultado.logo, { encoding: 'base64' });
                return res.status(201).json({ ...respuesta, imageLogo });

                //si hay background pero no hay logo 
            } if (background != undefined && logo === undefined) {
                delete req.body['logo'];
                const conf = new Configuration({
                    ...req.body,
                    // password: passwordHashed,
                    background: './uploads/background/' + background.filename
                });
                const resultado = await conf.save();
                const backgroundImage = fs.readFileSync(resultado.background, { encoding: 'base64' });

                return res.status(201).json({ ...respuesta, backgroundImage });

                //no hay background ni hay logo
            } else {
                delete req.body['logo'];
                delete req.body['background'];
                const conf = new Configuration({
                    ...req.body,
                    // password: passwordHashed,
                });
                const result = await conf.save();
                return res.status(201).json(respuesta)
            }
        }

    } catch (error) {
        res.status(400).json(error);
    }
};

const createUserAdmin = async (req, res) => {
    // E11000 duplicate key error collection: autoservicio_logicone.useradmins index: email_1 dup key: { email: "brooked@contoso.com" }
    try {
        const { password } = req.body;
        const passwordHashed = bcrypt.hashSync(password, 10);
        const adm = new UserAdmin({
            ...req.body,
            password: passwordHashed,
        });
        const result = await adm.save();
        return res.status(201).json({ success: true, result })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Este usuario ya se encuentra registrado como administrador' });
        }
       return res.status(400).json({ success: false, error: error.message});
    }
};

const deleteUserAdmin = async (req, res) => {
    try {
        const result = await UserAdmin.findByIdAndDelete(req.params._id);
        return res.status(200).json({ success: true, result })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

const getUserAdmin = async (req, res) => {
    try {
        const result = await UserAdmin.find();
        return res.status(200).json({ success: true, data: result })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const loginUser = async (req, res = response) => {
    const token = req.headers['authorization'];

    const { Personnelnumber } = req.body;

    const urlBase = process.env.URL_GET_CLASS;

    const url = `${urlBase}/GetLHEmployeeInformation`

    let rawData = JSON.stringify({ _json: `{\"Personnelnumber\":\"${Personnelnumber}\"}` })

    try {
        const resp = await axios.post(url, rawData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
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

const requestAccess = async (req, res = response) => {
    const token = req.headers['authorization'];
    const { Nombre, IdentificationNumber } = req.body;

    try {
        const resp = await sendRequestAccess(Nombre, IdentificationNumber, token);
        res.json({ success: resp.success, data: resp.data, message: resp.message });
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
    createUserAdmin,
    deleteUserAdmin,
    getUserAdmin,
    loginUser,
    requestAccess,
    renewToken
};