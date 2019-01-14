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

    db.collection('Todos').find({
        _id: new ObjectID('5c3bc91538b3f7304410104e')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, null, 2))
    }, (err) => {
        console.log(`Couldn't find the documents`, err);
    });

    //client.close();

});