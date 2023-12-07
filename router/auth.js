/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


//Crear nuevos usuarios
router.post('/new', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').notEmpty(),
    check('department', 'department is required').notEmpty(),
    // check('password', 'password must be greater than 5 characters').isLength({ min: 5 }), 
    // check('password').exists(),
    // check(
    //     '',
    //     'passwordConfirmation field mpasswordConfirmationust have the same value as the password field',
    // )
    //     .exists()
    //     .custom((value, { req }) => value === req.body.password),
    validateFields
], createUser);

// Login
router.post('/', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], loginUser);

//renovar token
router.get('/renew', validateJWT , renewToken);



module.exports = router;