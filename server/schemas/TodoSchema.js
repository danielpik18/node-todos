let {
    mongoose,
    Schema
} = require('../db/mongoose');

const TodoSchema = new Schema({
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //Removes white space
    },
    done: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {
    TodoSchema
};