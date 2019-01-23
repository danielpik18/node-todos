const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
});
module.exports = {
    mongoose,
    Schema
};

//Check connection

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connected to database successfully');
});