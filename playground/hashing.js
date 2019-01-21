const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

let msg = 'I am the only one';
let hash = SHA256(msg).toString();

//****************************************** */

/*
let data = {
    id: 5
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secret').toString()
}

let resultHash = SHA256(JSON.stringify(data) + 'secret').toString();


token.data.id = 3;
token.hash = SHA256(JSON.stringify(token.data)).toString();

if (resultHash === token.hash) {
    console.log('Data was not changed');
} else {
    console.log('Data was changed!!!');
}
*/

let data = {
    id: '123456',
    sex: 'male',
    sexSize: '15cm'
};

let token = jwt.sign(data, 'secretYO!');
let decoded = jwt.verify(token, 'secretYO!');

console.log('ENCRYPTED: ', token);
console.log('DECRYPTED:', decoded);