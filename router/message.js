/*
    Path: api/mensajes
*/
const{ Router } = require('express');
const { getChat } = require('../controllers/getChat');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.get('/:de', validateJWT, getChat );



module.exports = router;