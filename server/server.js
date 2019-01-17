const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

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
const port = process.env.PORT || 3000;
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

//GET/todos/:id
app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id).then(todo => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch(error => res.status(400).send({
        error: error.message
    }));
});

//Set up port
app.listen(port, () => {
    console.log(`App hosted on port ${port}`);
});



module.exports = {
    app
};

// /DELETE/todos/:id
app.delete('/todos/:id', (req, res) => {
    Todo.findByIdAndDelete(req.params.id).then(todo => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch(error => res.status(400).send({
        error: error.message
    }));
})

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['done', 'description']);
    console.log(body);

    if (_.isBoolean(body.done) && body.done) {
        body.completedAt = new Date().getTime();
    } else {
        body.done = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch(error => res.status(400).send({
        error
    }));
});