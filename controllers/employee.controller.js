const { response } = require('express');
const {
    getAddressByEmployee,
    getContactDetailsByEmployee,
    getPersonalContactsByEmployee,
    getPersonalIdsByEmployee,
    getPaymentsMethodsByEmp
} = require('../service/employee.service');


const getAdressEmployee = async (req, res = response) => {
    const Personnelnumber = req.query.PersonnelNumber;
    const token = req.headers['authorization'];
    try {
        const resp = await getAddressByEmployee(Personnelnumber, token);
        res.json({ success: true, data: resp.data.value });
    } catch (error) {
        return res.json(error)
    }
};

const getContactDetailsEmployee = async (req, res = response) => {
    const Personnelnumber = req.query.PersonnelNumber;
    const token = req.headers['authorization'];
    try {
        const resp = await getContactDetailsByEmployee(Personnelnumber, token);
        res.json({ success: true, data: resp.data.value });
    } catch (error) {
        return res.json(error)
    }
};

const getPersonalContactsEmployee = async (req, res = response) => {
    const WorkerPersonnelNumber = req.query.WorkerPersonnelNumber;
    const token = req.headers['authorization'];
    try {
        const resp = await getPersonalContactsByEmployee(WorkerPersonnelNumber, token);
        res.json({ success: true, data: resp.data});
    } catch (error) {
        return res.json(error)
    }
};

const getPersonalIds = async (req, res = response) => {
    const PartyNumber = req.query.PartyNumber;
    const token = req.headers['authorization'];
    try {
        const resp = await getPersonalIdsByEmployee(PartyNumber, token);
        res.json({ ok: true, data: resp.data.value });
    } catch (error) {
        return res.json(error)
    }
};

const getPaymentsMethods = async (req, res = response) => {
    const PersonnelNumber = req.query.PersonnelNumber;
    const token = req.headers['authorization'];
    try {
        const resp = await getPaymentsMethodsByEmp(PersonnelNumber, token);
        res.json({ ok: true, data: resp.data.value });
    } catch (error) {
        return res.json(error)
    }
};

module.exports = {
    getAdressEmployee,
    getContactDetailsEmployee,
    getPersonalContactsEmployee,
    getPersonalIds,
    getPaymentsMethods,
};