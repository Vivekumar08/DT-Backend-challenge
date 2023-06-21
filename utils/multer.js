const multer = require('multer')
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Maximum file size (in bytes). Here, it's set to 5MB.
    },
    fileFilter: (req, file, cb) => {
        // Check the file type to allow only specific extensions (e.g., JPEG, PNG)
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG files are allowed'));
        }
    }
});

module.exports = upload