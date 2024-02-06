/*
    path: api/general
*/
const { Router } = require('express');
const { generalController, createGeneralCase } = require('../controllers/general.controller');


const router = Router();

router.get('/', generalController);

router.post('/', createGeneralCase);

module.exports = router;