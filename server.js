const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/'));
app.use('/assets', express.static(__dirname + '/src/assets/'));

app.get('/examples', express.static(__dirname + '/dist/examples/'));

app.listen(process.env.PORT || 8080);
