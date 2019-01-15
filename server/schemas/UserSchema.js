let {
    mongoose,
    Schema
} = require('../db/mongoose');

let UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //Removes white space
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //Removes white space
    }
});

module.exports = {
    UserSchema
};