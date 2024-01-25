const multer = require('multer');

const saveImage = multer.diskStorage({
    destination: (req, file, cb) => {
        // The destination is determined by the `destination` option
        if(file.fieldname === "logo"){
            cb(null, './uploads/logo')
        } else {
            cb(null, './uploads/background')
        }
    },
    filename: (req, file, cb) => {
        if(file !== null) {
            const ext = file.originalname.split('.').pop();
            cb(null, Date.now() + '.'+ext);  // Use original name
        }
    }
});

const filterImage = (req, file, cb) => {
    // Accept only image files, reject everything else
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadImage = multer({ storage: saveImage, fileFilter: filterImage })

module.exports = { uploadImage };