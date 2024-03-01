const { response } = require('express');
const { getDataFormCase, requestCaseByEmployee } = require('../service/general.service');
const { default: axios } = require('axios');

const generalController = async (req, res = response) => {
    const token = req.headers['authorization'];
    const { Personnelnumber } = req.query;

    const urlBase = process.env.URL_GET_CLASS;
    const urlAddress = `${urlBase}/GetTestCustomClass`;
    let rawData = JSON.stringify({ _json: `{\"Personnelnumber\":\"${Personnelnumber}\"}` })

    try {
        const result = await axios.post(urlAddress, rawData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const { data } = result;
        const { Received, Status } = JSON.parse(data);
        const statusData = JSON.parse(JSON.stringify(Status))
        const obj = { categoria: JSON.parse(Received), estado: JSON.parse(statusData) }
        res.json({ success: true, data: obj });
    } catch (error) {
        return res.json({
            success: false,
            status: error.response.status,
            statusText: error.response.statusText
        })
    }
}

const createGeneralCase = async (req, res = response) => {
    const token = req.headers['authorization'];

    try {
        const datos = { ...req.body };
        const resp = await requestCaseByEmployee(datos, token)
        res.json({ success: resp.success, data: resp.data });
    } catch (error) {
        console.log(error);
        return res.json(error)
    }

}

module.exports = {
    generalController,
    createGeneralCase
};