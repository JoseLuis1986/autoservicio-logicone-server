const { response } = require('express');
const bcrypt = require('bcryptjs');
const Configuration = require('../models/configuration');

const getConfirmationPassword = async (req, res = response) => {
    Configuration.findOne()
        .then((conf) => {
            if (conf) {
                bcrypt.compare(req.body.password, conf.password, function (err, isMatch) {
                    if (!isMatch) {
                        res.json({ success: false, msg: 'Contraseña incorrecta' });
                    } else {
                        res.json({ success: true, msg: 'contraseña correcta' })
                    }
                })
            } else {
                res.json({ success: false, msg: 'Clave incorrecta' })
            }
        })
}

const getConfigurationEntitie = async (req, res = response) => {
    Configuration.findOne()
        .then((conf) => {
            if (conf) {
                res.json({ success: true, data: conf });
            } else {
                res.json({ success: false, data: [] })
            }
        })
        .catch((err) => {
            res.json({ success: false, msg: err.message })
        })
}


const updateConfigurations = async (req, res = response) => {
    try {
        const hasLogo = req.files.logo && req.files.logo[0];
        const hasBg = req.files.background && req.files.background[0];
        const logoPpal = hasLogo ? './uploads/logo/' + hasLogo.filename : req.body.logo;
        const bg = hasBg ? './uploads/background/' + hasBg.filename : req.body.background;
        const { _id } = req.body;
        const datos = await Configuration.findById(_id);
        const newData = { ...req.body, logo: logoPpal, background: bg };
        const result = await Configuration.findByIdAndUpdate(_id, newData)
        res.status(200).json({ success: true, data: result, msg: 'Sus datos han sido actualizados exitosamente' })
        
    } catch (error) {
        return res.status(400).json({ success: false, msg: error })
    }

}

module.exports = {
    getConfirmationPassword,
    getConfigurationEntitie,
    updateConfigurations
}