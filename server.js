const express = require('express');
const path = require('path');
const app = express();

app.use('/', express.static(__dirname + '/dist/main/'));
app.use('/assets', express.static(__dirname + '/src/assets/'));

app.use('/examples', express.static(__dirname + '/dist/examples/'));

// app.use('/examples/assets', express.static(__dirname + '/src/assets/'));

app.listen(process.env.PORT || 8080);

console.log('Server is open at port: ', process.env.PORT || 8080);
