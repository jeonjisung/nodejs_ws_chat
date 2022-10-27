const express = require('express');
const router = express.Router();
const userController = require('./user.controller')

router.get('/join',userController.join);
router.post('/join_success', userController.join_success);
router.get('/login', userController.login);
router.post('/login_check', userController.login_check);
router.get('/logout', userController.logout);
router.get('/info', userController.user_info);
router.get('/userid_check', userController.userid_check);
router.post('/info_user.chart', userController.process.users_result);
router.post('/info_chat.chart', userController.process2.chat_result);
router.post('/info_user.chat', userController.process3.user_chat);
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

module.exports=router;