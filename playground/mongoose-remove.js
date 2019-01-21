const {
    mongoose
} = require('../server/db/mongoose');
const {
    TodoSchema
} = require('../server/schemas/TodoSchema');

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');

Todo.remove({}).then(res => console.log(res));