/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createConf, loginUser, renewToken, getConfigurations } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//Obtener la configuracion del cliente principal
router.get('/', getConfigurations)

// Login empleados
router.post('/', [
    check('Personnelnumber', 'email is required').notEmpty(),
    check('Identification', 'Identificacion is required').notEmpty(),
    check('Nombre', 'Nombre es requerido').notEmpty(),
    validateFields
], loginUser);

//Crear nuevas configuraciones
/**TO-DO probar que no se cree otra configuracion igual a la que ya existe */
router.post('/new', [
    check('tenant_id', 'tenant_id is required').not().isEmpty(),
    check('client_id', 'client_id is required').notEmpty(),
    check('client_secret', 'client_secret is required').notEmpty(),
    check('grant_type', 'grant_type is required').notEmpty(),
    check('resource', 'resource is required').notEmpty(),
    // check('password', 'password must be greater than 5 characters').isLength({ min: 5 }), 
    // check('password').exists(),
    // check(
    //     '',
    //     'passwordConfirmation field mpasswordConfirmationust have the same value as the password field',
    // )
    //     .exists()
    //     .custom((value, { req }) => value === req.body.password),
    validateFields
], createConf);

//renovar token
router.get('/renew', renewToken);



module.exports = router;