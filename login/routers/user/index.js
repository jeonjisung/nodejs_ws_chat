const express = require('express');
const router = express.Router();
const userController = require('./user.controller')

router.get('/join',userController.join);
router.post('/join_success', userController.join_success);
router.get('/login', userController.login);
router.post('/login_check', userController.login_check);
router.get('/logout', userController.logout);
router.get('/info', userController.info);
router.get('/userid_check', userController.userid_check);
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

module.exports=router;