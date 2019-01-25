const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

//  ------------------------------------------------
const {
    app
} = require('../server');
const {
    ObjectID
} = require('mongodb');
const {
    Todo
} = require('../schemas/TodoSchema');
const {
    User
} = require('../schemas/UserSchema');
const {
    todos,
    users,
    populateTodos,
    populateUsers
} = require('./seed/seed');

beforeEach(populateTodos); // Before each test
beforeEach(populateUsers); // Before each test

//POST TESTING
describe('POST /todos', () => {
    it('Should create a new Todo', done => {
        let description = 'Todo description';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({
                description
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.description).toBe(description);
            })
            .end((error, res) => {
                if (error) return done(error);

                Todo.find({
                    description
                }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].description).toBe(description);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should not add Todo with invalid data', done => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((error, res) => {
                if (error) return done(error);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});


//GET TESTING
describe('GET/todos', () => {
    it('Should fetch all todos', done => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done);
    });
});

//GET/todos:id TESTING
describe('GET/todos/:id', () => {

    it('Should return the todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.description).toBe(todos[0].description)
            })
            .end(done);
    });

    it('Should NOT return a todo doc created by another user', done => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 400 if data is invalid', done => {
        request(app)
            .get(`/todos/1337`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });
});

//DELETE/todos/:id
describe('DELETE/todos/:id', () => {
    it('Should delete a todo', done => {
        let hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((error, res) => {
                if (error) return done(error);

                Todo.findById(hexID).then(todo => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should delete a todo', done => {
        let hexID = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((error, res) => {
                if (error) return done(error);

                Todo.findById(hexID).then(todo => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch(err => done(err));
            });
    });


    it('Should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 400 if data is invalid', done => {
        request(app)
            .get(`/todos/1337`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end(done);
    });
});

//PATCH/todos/:id
describe('PATCH/todos/:id', () => {
    it('Should update the Todo', done => {
        let hexID = todos[0]._id.toHexString();
        let description = 'UPDATED DESCRIPTION YOOO.';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                done: true,
                description
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.description).toBe(description);
                expect(res.body.todo.done).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('Should NOT update a Todo created by another user', done => {
        let hexID = todos[0]._id.toHexString();
        let description = 'UPDATED DESCRIPTION YOOO.';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                done: true,
                description
            })
            .expect(404)
            .end(done);
    });


    it('Should clear completedAt when todo is not done', done => {
        let hexID = todos[1]._id.toHexString();
        let description = 'UPDATED DESCRIPTION YOOO. XDXDXDXD';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                done: false,
                description
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.description).toBe(description);
                expect(res.body.todo.done).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

//GET/users/me
describe('GET/users/me', () => {
    it('Should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return a 401 if not authenticated', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

//POST/users
describe('POST/users', () => {
    it('Should create a new user', done => {
        let email = 'example@test.com';
        let password = '123456';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(error => {
                if (error) return done(error);

                User.findOne({
                    email
                }).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should return 400 bad request', done => {
        request(app)
            .post('/users')
            .send({
                email: 'invalidEmail',
                password: 'short'
            })
            .expect(400)
            .end(done);
    });

    it('Should not create user if email already exists', done => {
        let email = 'testUser1@mail.com';
        let password = '123456';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .expect(res => {
                User.findOne({
                    email
                }).then(user => {
                    expect(user.email).toBe(email);
                })
            })
            .end(done);

    });
});



//POST/users/login
describe('POST/users/login', () => {
    it('Should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((error, res) => {
                if (error) done({
                    error
                });

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(err => done({
                    error: err
                }));
            });
    });

    it('Should reject invalid user', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'invalidPassword'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((error, res) => {
                if (error) done({
                    error
                });

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(err => done({
                    error: err
                }));

            });
    });

});

//DELETE/users/logout
describe('DELETE/users/logout', () => {
    it('Should remove auth token on logout', done => {
        request(app)
            .delete('/users/logout')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error, res) => {
                if (error) done({
                    error
                });

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(err => done({
                    err
                }));
            })
    });
});