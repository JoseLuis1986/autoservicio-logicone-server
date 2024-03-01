/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createConf, loginUser, renewToken, getConfigurations, requestAccess, createUserAdmin, getUserAdmin, deleteUserAdmin } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { uploadImage } = require('../middlewares/storage');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//Obtener la configuracion del cliente principal
router.get('/', getConfigurations)

//Crear nuevas configuraciones
router.post('/new', uploadImage.fields([{
  name: 'logo', maxCount: 1
}, {
  name: 'background', maxCount: 1
}]), createConf);

//Crear usuario admin
router.post('/new-useradmin', [
  check('codigo', 'El Codigo de empleado es requerido').notEmpty(),
  check('name', 'El Nombre es requerido').notEmpty(),
  check('email', 'Tu email no es valido').not().isEmpty().isEmail().normalizeEmail(),
  check('password', 'Debes ingresar una contraseña').notEmpty(),
  validateFields
], createUserAdmin);

//Obtener usuario admin
router.get('/user-admin', getUserAdmin);

//Eliminar usuario admin4
router.delete('/user-admin/:_id', deleteUserAdmin);

// Login empleados
router.post('/', [
  check('Personnelnumber', 'El Codigo de empleado es requerido').notEmpty(),
  validateFields
], loginUser);

// Solicitud de acceso del empleado
router.post('/request-access', [
  check('IdentificationNumber', 'La Identificacion is requrida').notEmpty(),
  check('Nombre', 'El Nombre es requerido').notEmpty(),
  // check('Email', 'Tu email no es valido').not().isEmpty().isEmail().normalizeEmail(),
  validateFields
], requestAccess);

//renovar token
router.get('/renew', renewToken);



module.exports = router;