const {
    mongoose,
    Schema
} = require('../db/mongoose');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, //Removes white space
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    let userObj = this.toObject();
    return _.pick(userObj, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    let access = 'auth';
    let token = jwt.sign({
        _id: this._id.toHexString(),
        access
    }, 'abc123').toString();

    this.tokens = this.tokens.concat([{
        access,
        token
    }]);

    return this.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    let decodedUser;

    try {
        decodedUser = jwt.verify(token, 'abc123')
    } catch (error) {
        console.log(error);
        return Promise.reject();
    }

    return this.findOne({
        '_id': decodedUser._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema, 'Users');


module.exports = {
    User
};