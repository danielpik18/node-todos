const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Connection to mongoDB server FAILED.');
    }

    console.log('Connected successfully to mongoDB server.');
    const db = client.db('TodoApp');


    db.collection('Todos').insertOne({
        description: 'Walk the dog 7:00 PM',
        done: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert to Todos.', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        name: 'Daniel',
        age: 20,
        location: 'Barranquilla'
    }, (err, result) => {
        if (err) return console.log('Unable to insert to Users', err);
        console.log(result.ops[0]._id.getTimestamp());
    })


    client.close();

});