const {
    ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');

//  ------------------------------------------------

const {
    Todo
} = require('../../schemas/TodoSchema');
const {
    User
} = require('../../schemas/UserSchema');

const user1id = new ObjectID();
const user2id = new ObjectID();

const users = [{
    _id: user1id,
    email: 'testUser1@mail.com',
    password: 'user1pw',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: user1id,
            access: 'auth'
        }, 'abc123').toString()
    }]
}, {
    _id: user2id,
    email: 'testuserTWO@fk.gay',
    password: 'datpasstho',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: user2id,
            access: 'auth'
        }, 'abc123').toString()
    }]
}];


const todos = [{
        _id: new ObjectID(),
        _creator: user1id,
        description: 'First test todo'
    },
    {
        _id: new ObjectID(),
        _creator: user2id,
        description: 'Second test fker',
        done: true,
        completedAt: 3004
    }

];

const populateTodos = done => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = done => {
    User.deleteMany({}).then(() => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();

        return Promise.all([user1, user2]);
    }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
}