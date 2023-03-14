const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth')

const AdminController = require('../controllers/admin');

router.post('/login', AdminController.admin_login);

router.post('/logout',checkAuth, AdminController.admin_logout);

module.exports = router;