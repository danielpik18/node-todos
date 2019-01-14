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

    db.collection('Todos').deleteMany({
        done: true
    }).then((result) => {
        console.log(result);
    });

    //client.close();

});