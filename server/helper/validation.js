
const {check} = require('express-validator')

exports.validateLogin = [
    check('email')
    .isEmail()
    .withMessage('Email address is not valid'),
    check('password','Password is required').notEmpty(),
    check('password').isLength({
        min:6
    }).withMessage('Password must contain at least 6 characters')
]

exports.errorModel = (error)=>{
return {error : error, name : 'dataValidationError'}
}