const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'Enter a Email.'],
        validate: [validator.isEmail, 'Enter a valid Email address.']
    },
    name: {
        type: String,
        required: [true, 'Enter a User Name.'],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        required: [true, 'Enter a Password.'],
        minlength: [6, 'Password should be at least 6 characters.']
    },

    role: {
        type: String,
        default: 'Normal'
    },
    resetPasswordLink: {
        data: String,
        default: ''
    },
    isAccAcivated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
userSchema.methods = {
    verifyPassword: function (password, cb) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
}

module.exports = mongoose.model('User', userSchema)