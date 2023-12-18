const { response } = require('express');
const {
    getAddressByEmployee,
    getContactDetailsByEmployee,
    getPersonalContactsByEmployee,
    getPersonalIdsByEmployee,
    getPaymentsMethodsByEmp
} = require('../service');


const getAdressEmployee = async (req, res = response) => {
    const Personnelnumber = req.query.PersonnelNumber;
    console.log('ID', Personnelnumber);
    const token = req.headers['authorization'];
    // // const token = tk.split(" ")[1]
    const resp = await getAddressByEmployee(Personnelnumber, token);
    // console.log(resp.data)
    res.json({ ok: true, data: resp.data.value })
};

const getContactDetailsEmployee = async (req, res = response) => {
    const Personnelnumber = req.query.PersonnelNumber;
    const token = req.headers['authorization'];
    const resp = await getContactDetailsByEmployee(Personnelnumber, token);
    res.json({ ok: true, data: resp.data.value });
};

const getPersonalContactsEmployee = async (req, res = response) => {
    const WorkerPersonnelNumber = req.query.WorkerPersonnelNumber;
    const token = req.headers['authorization'];
    const resp = await getPersonalContactsByEmployee(WorkerPersonnelNumber, token);
    res.json({ ok: true, data: resp.data.value });
};

const getPersonalIds = async (req, res = response) => {
    const PartyNumber = req.query.PartyNumber;
    const token = req.headers['authorization'];
    const resp = await getPersonalIdsByEmployee(PartyNumber, token);
    res.json({ ok: true, data: resp.data.value });
};

const getPaymentsMethods = async (req, res = response) => {
    const PersonnelNumber = req.query.PersonnelNumber;
    const token = req.headers['authorization'];
    const resp = await getPaymentsMethodsByEmp(PersonnelNumber, token);
    res.json({ ok: true, data: resp.data.value });
};

module.exports = {
    getAdressEmployee,
    getContactDetailsEmployee,
    getPersonalContactsEmployee,
    getPersonalIds,
    getPaymentsMethods,
};