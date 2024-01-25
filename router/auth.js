/*
    path: api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createConf, loginUser, renewToken, getConfigurations, requestAccess } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { uploadImage } = require('../middlewares/storage');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//Obtener la configuracion del cliente principal
router.get('/', getConfigurations)

//Crear nuevas configuraciones
/**TO-DO probar que no se cree otra configuracion igual a la que ya existe */

// router.post('/new', uploadImage.single('logo'), createConf);
router.post('/new', uploadImage.fields([{
  name: 'logo', maxCount: 1
}, {
  name: 'background', maxCount: 1
}]), createConf);


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