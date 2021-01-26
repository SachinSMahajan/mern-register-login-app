const express = require('express')
const {validateLogin} = require('../helper/validation')
const {registerController} = require('../controllers/registerController')
const {loginController} = require('../controllers/loginController')

const route = express.Router()
route.post('/register',registerController)
route.post('/login',validateLogin,loginController)

module.exports = route;
