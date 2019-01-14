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

    /*
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5c3bc91538b3f7304410104e')
    }, {
        $set: {
            done: true
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });
    */

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c3bcd551151710510aa7c97')
    }, {
        $inc: {
            age: -2
        }
    }, {
        returnOriginal: false
    }).then(res => {
        console.log(res);
    })

    //client.close();

});