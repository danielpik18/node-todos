const {
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
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');

module.exports = {
    Todo
};