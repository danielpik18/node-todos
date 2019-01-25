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
app.post('/todos', authenticate, (req, res) => {

    let newTodo = new Todo({
        _creator: req.user._id,
        description: req.body.description
    });

    newTodo.save().then(doc => {
        res.send(doc);
    }, error => {
        res.status(400).send(error);
    });

});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(todos => {
        res.send({
            todos
        });
    }, error => {
        res.status(400).send(error);
    });
});

//GET/todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
    Todo.findOne({
        _id: req.params.id,
        _creator: req.user._id
    }).then(todo => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch(error => res.status(400).send({
        error: error.message
    }));
});

// /DELETE/todos/:id
app.delete('/todos/:id', authenticate, (req, res) => {
    Todo.findOneAndDelete({
        _id: req.params.id,
        _creator: req.user._id
    }).then(todo => {
        if (!todo) return res.status(404).send();
        res.send({
            todo
        });
    }).catch(error => res.status(400).send({
        error: error.message
    }));
})

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['done', 'description']);

    if (_.isBoolean(body.done) && body.done) {
        body.completedAt = new Date().getTime();
    } else {
        body.done = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
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
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(newUser);
    }).catch(error => res.status(400).send({

    }));
});

//POST/users/login
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send({
                user
            });
        });
    }).catch(error => {
        res.status(400).send();
    });
});

//DELETE/users/logout
app.delete('/users/logout', authenticate, (req, res) => {

    req.user.logout(req.token).then(() => {
        res.status(200).send();
    }).catch(error => res.status(400).send({
        error
    }));

});