'use strict';
console.log('hello')

const app = require('./server/api');

app.listen(3000, () => console.log('Local app listening on port 3000!'));