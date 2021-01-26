const jwt = require('jsonwebtoken')
const sgmail = require('@sendgrid/mail')
const User = require('../models/userModel')
sgmail.setApiKey(process.env.MAIL_KEY)

exports.registerController = async (req, res, next) => {
   try {
      const { name, email, password } = req.body;
      const Usermodel = new User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
      })
      //Insert user in mongo db
      const newUser = await Usermodel.save();//User.create(Usermodel);
      // User.findOne(
      //    {email}
      //    ).exec((err,user)=>{
      //       if(user){
      //          return res.status(400).json({
      //             messsage : `An account with email ${email} already exists.`
      //          })
      //       }
      //    })

      //Create JSON web token with Id of newly created user
      const token = jwt.sign({
         id: newUser.Id,
      },
         process.env.JWT_ACC_ACTIVATION,
         {
            expiresIn: '15m'
         })

      const emailContent = {
         from: process.env.MAIL_FROM,
         to: email,
         subject: 'Account activation link',
         html: `
         <h1>Welcome ${name}! </h1>

         <p>Thanks for signing up with MERN app!</p>
         <p>You must follow this link to activate your
          account: </p>
          <a>${process.env.CLIENT_URL}/account/activate/${token}</a>
          <h1>Have fun coding..</h1>
          `
      }
      sgmail.send(emailContent).then(sent => {
         return res.json({
            messsage: `Email has been sent to ${email}`
         })
      }).catch(err => {
         next(err);
      })
   }
   catch (err) {
      next(err);
   }
}
