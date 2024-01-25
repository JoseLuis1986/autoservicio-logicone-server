/*
    path: api/general
*/
const { Router } = require('express');
const generalController = require('../controllers/general.controller');


const router = Router();

router.get('/', generalController);

module.exports = router;