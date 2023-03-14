const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');

const CategoryController = require('../controllers/category');

router.get('/',checkAuth, CategoryController.get_all_category);

router.post('/',checkAuth,CategoryController.add_category);

router.patch('/:categoryId',checkAuth,CategoryController.edit_category);

router.delete('/:categoryId',checkAuth,CategoryController.delete_category);

module.exports = router