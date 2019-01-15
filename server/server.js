let express = require('express');
let bodyParser = require('body-parser');

let {
    mongoose
} = require('./db/mongoose');

// -- SCHEMAS IMPORT
let {
    TodoSchema
} = require('./schemas/TodoSchema');
let {
    UserSchema
} = require('./schemas/UserSchema');

// -- MODELS

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');
let User = mongoose.model('User', UserSchema, 'Users');



// ---------- Main code ------------

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    let newTodo = new Todo({
        description: req.body.description
    });

    newTodo.save().then(doc => {
        res.send(doc);
    }, error => {
        res.status(400).send(error);
    });

});

app.listen(3000, () => {
    console.log(`App hosted on port 3000`);
});