/*
    path: api/employee
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const {
    getAdressEmployee,
    getContactDetailsEmployee,
    getPersonalContactsEmployee,
    getPersonalIds,
    getPaymentsMethods,
    getEmployeeByCode
} = require('../controllers/employee.controller');

const router = Router();

//Obtener el empleado por codigo
router.get('/', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields
], getEmployeeByCode);


//Obtener las direcciones del empleado
router.get('/addresses', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields
], getAdressEmployee);

//Obtener detalles del contacto
router.get('/contacts-details', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields
], getContactDetailsEmployee);

//Obtener contactos personales
router.get('/personal-contacts', [
    check('WorkerPersonnelNumber', 'WorkerPersonnelNumber Number is required').notEmpty(),
    validateFields
], getPersonalContactsEmployee);


//Obtener los datos de identificacion
router.get('/personal-ids', [
    check('PartyNumber', 'PartyNumber is required').notEmpty(),
    validateFields
], getPersonalIds);


//Obtener los metodos de pagos
router.get('/payments-methods', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields
], getPaymentsMethods);


module.exports = router;