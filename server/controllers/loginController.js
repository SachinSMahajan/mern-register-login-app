const User = require('../models/userModel')
const { validationResult } = require('express-validator')
const { errorModel } = require('../helper/validation')
exports.loginController = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const error = errorModel(errors)
            next(error)
        } else {
            const { password, email } = req.body;
            User.findOne(
                { email }
            ).exec((err, user) => {
                if (!user) {
                    return res.status(400).json({
                        messsage: `An account with email ${email} does not exists.`
                    })
                }

                //Authenticate password
                user.verifyPassword(password, function (err, isMatch) {
                    if (err) throw err;

                    if (isMatch) {
                        return res.status(200).json({
                            messsage: "Login successful"
                        })
                    } else {
                        return res.status(400).json({
                            messsage: "Email or Password does not match"
                        })
                    }
                });
            })
        }
    } catch (error) {
        next(error);
    }
}
