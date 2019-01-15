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


//ADD NEW TODO
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

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({
            todos
        });
    }, error => {
        res.status(400).send(error);
    });
});

//Set up port 3000
app.listen(3000, () => {
    console.log(`App hosted on port 3000`);
});



module.exports = {
    app
};