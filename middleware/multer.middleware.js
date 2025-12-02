const multer = require('multer')
const path = require('path')

// Dynamic storage - saves to different folders based on field name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profilePicture') {
            return cb(null, 'profilePicture/') 
        }else if (file.fieldname === 'resume')
            return cb(null, 'resume/')  
        else{
            cb(null, 'uploads/')
        }       
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))        // Unique filename
    }
})

// File filter - different allowed types for different fields
const fileFilter = (req, file, cb) => {
    if(file.fieldname === 'profilePicture'){
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
        }
    }else if (file.fieldname === 'resume'){
        const allowedTypes = ['application/pdf', 'application/msword']
        if(allowedTypes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error('Invalid file type. Only PDF and DOC are allowed.'), false);
        }
    }else{
        cb(new Error('Unknown field name'), false);
    }
}

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: fileFilter });

module.exports = upload;