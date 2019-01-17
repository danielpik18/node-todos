const {
    mongoose
} = require('../db/mongoose');
const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('../server');
let {
    TodoSchema
} = require('../schemas/TodoSchema');

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');

const todos = [{
        _id: new ObjectID(),
        description: 'First test todo'
    },
    {
        _id: new ObjectID(),
        description: 'Second test fker'
    }
];

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

//POST TESTING
describe('POST /todos', () => {
    it('Should create a new Todo', done => {
        let description = 'Todo description';

        request(app)
            .post('/todos')
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
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

//GET/todos:id TESTING
describe('GET/todos/:id', () => {
    //this.timeout(10000);
    it('Should return the todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.description).toBe(todos[0].description)
            })
            .end(done);
    });

    it('Should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 400 if data is invalid', done => {
        request(app)
            .get(`/todos/1337`)
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


    it('Should return 404 if todo not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 400 if data is invalid', done => {
        request(app)
            .get(`/todos/1337`)
            .expect(400)
            .end(done);
    });
});