/*
    path: api/config-update
*/
const { Router } = require('express');
const { getConfirmationPassword, getConfigurationEntitie, updateConfigurations } = require('../controllers/configupdate.controller');
const { uploadImage } = require('../middlewares/storage');
const { getUserAdmin } = require('../controllers/auth');


const router = Router();

router.get('/', getConfigurationEntitie);

router.post('/', getConfirmationPassword);

router.put('/', uploadImage.fields([{
    name: 'logo', maxCount: 1
}, {
    name: 'background', maxCount: 1
}]), updateConfigurations);


module.exports = router;