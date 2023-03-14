const express = require('express');
const router = express.Router();
const multer = require('multer');

const BlogController = require('../controllers/blog');
const checkAuth = require('../middlewares/check-auth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else {
        cb(null, false); 
    }
}

const upload = multer({ storage : storage,
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/',checkAuth,upload.single('blogImage'),BlogController.add_blog);

router.get('/',checkAuth,BlogController.get_all_blogs);

router.patch('/:blogId',checkAuth,BlogController.update_blog);

router.delete('/:blogId',checkAuth,BlogController.delete_blog);

module.exports = router;