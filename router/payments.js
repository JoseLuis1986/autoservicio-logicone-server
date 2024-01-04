/*
    Path: api/payments
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { 
    getAllPayments, 
    getLeaveAndAbsence, 
    timeOffRequestEmployee, 
    approvedTimeOff, 
    requestTimeOff, 
    getTypeLeave, 
    getPayStatementEarningLine, 
    getAccumulationEarnings, 
    getDeductionsByBenefit, 
    getDeductionsImpuestos
} = require('../controllers/payments.controller');
// const { getChat } = require('../controllers/getChat');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// obtener todos los pagos
router.get('/', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    check('Name', 'El nombre es requerido').notEmpty(),
    validateFields
], getAllPayments);

//Obtener lista de permisos hasta la fecha
router.get('/time-off', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields,
], getLeaveAndAbsence)

//Obtener todos los permisos aprobados
router.get('/time-off-approved', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields,
], approvedTimeOff)

//Obtener las peticiones de permisos solicitados
router.get('/time-off-request', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields,
], timeOffRequestEmployee)

//Obtener tipos de permiso
router.get('/leave-types', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields,
], getTypeLeave)

//Hacer solicitudes de permiso
router.post('/', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    validateFields,
], requestTimeOff)

//obtener las ganancias de un empleado
router.get('/payroll-statementlist', [
    check('PersonnelNumber', 'PersonnelNumber is required').notEmpty(),
    check('PayStatementNumber', 'PayStatementNumber is required').notEmpty(),
    validateFields,
], getPayStatementEarningLine)

//obtener las acumulaciones de beneficio del empleado
router.get('/accumulation', [
    check('PayStatementNumber', 'PayStatementNumber is required').notEmpty(),
    validateFields,
], getAccumulationEarnings)

//Obtener las deducciones de beneficio del empleado
router.get('/deductions', [
    check('PayStatementNumber', 'PayStatementNumber is required').notEmpty(),
    validateFields
], getDeductionsByBenefit)

//obtener las deducciones de impuestos del empleado
router.get('/deductions-imp', [
    check('PayStatementNumber', 'PayStatementNumber is required').notEmpty(),
    validateFields
], getDeductionsImpuestos)

module.exports = router;