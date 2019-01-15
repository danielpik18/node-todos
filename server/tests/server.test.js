const {
    mongoose
} = require('../db/mongoose');
const expect = require('expect');
const request = require('supertest');

const {
    app
} = require('../server');
let {
    TodoSchema
} = require('../schemas/TodoSchema');

let Todo = mongoose.model('Todo', TodoSchema, 'Todos');

const todos = [{
        description: 'First test todo'
    },
    {
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