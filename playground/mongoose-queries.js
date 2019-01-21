const {
    mongoose
} = require('../server/db/mongoose');
const {
    TodoSchema
} = require('../server/schemas/TodoSchema');

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');
let id = '5c3e11fe61b56d0dd8d89c02';

/*
Todo.find({
    _id: id
}).then(todos => {
    console.log(todos);
});

Todo.findOne({
    done: false
}).then(todo => {
    console.log('Todo', todo);
});
*/

Todo.findById(id).then(todo => {
    if (!todo) return console.log('ID not found.');
    console.log(todo);
}).catch(err => console.log(err));