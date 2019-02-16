const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {
    authenticate
} = require('./middleware/authenticate');
let {
    mongoose
} = require('./db/mongoose');

// -- MODELS IMPORT
let {
    Todo
} = require('./schemas/TodoSchema');
let {
    User
} = require('./schemas/UserSchema');

// ---------- Main code ------------

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 3000;



//  --** TODOS **--

//ADD NEW TODO
app.post('/todos', authenticate, async (req, res) => {
    try {
        const newTodo = new Todo({
            _creator: req.user._id,
            description: req.body.description
        });
        const todo = await newTodo.save();
        res.send(todo);
    } catch (error) {
        res.status(400).send({
            error
        });
    };
});

app.get('/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({
            _creator: req.user._id
        });
        res.send({
            todos
        });
    } catch (error) {
        res.status(400).send({
            error
        });
    };

});

//GET/todos/:id
app.get('/todos/:id', authenticate, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            _creator: req.user._id
        });
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

// /DELETE/todos/:id
app.delete('/todos/:id', authenticate, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            _creator: req.user._id
        });
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
})

app.patch('/todos/:id', authenticate, async (req, res) => {
    try {
        let id = req.params.id;
        let body = _.pick(req.body, ['done', 'description']);

        if (_.isBoolean(body.done) && body.done) {
            body.completedAt = new Date().getTime();
        } else {
            body.done = false;
            body.completedAt = null;
        }

        let todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {
            $set: body
        }, {
            new: true
        });
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    } catch (error) {
        res.status(400).send({
            error
        })
    }
});



//  --** USERS **--

//GET/users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//Set up port
app.listen(port, () => {
    console.log(`App hosted on port ${port}`);
});

module.exports = {
    app
};

//POST /users
app.post('/users', async (req, res) => {
    try {
        let body = _.pick(req.body, ['email', 'password']);
        let newUser = new User(body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.header('x-auth', token).send(newUser);
    } catch (error) {
        res.status(400).send({
            error
        });
    }
});

//POST/users/login
app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send({
            user
        });
    } catch (error) {
        res.status(400).send({
            error
        });
    }
});

//DELETE/users/logout
app.delete('/users/logout', authenticate, async (req, res) => {
    try {
        await req.user.logout(req.token)
        res.status(200).send();
    } catch (error) {
        res.status(400).send({
            error
        });
    };
});