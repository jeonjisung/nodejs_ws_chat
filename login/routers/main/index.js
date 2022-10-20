const express = require('express');
const router = express.Router();
const mainController = require('./main.controller')

router.use('/', mainController.main);

module.exports=router;