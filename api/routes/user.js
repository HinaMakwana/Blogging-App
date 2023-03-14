const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.get('/user',UserController.latest_blog);

router.get('/blogs/:title',UserController.get_blog);

router.get('/search', UserController.search_title);

router.get('/query',UserController.search_through_query);

router.get('/:slug',UserController.search_slug);

module.exports = router