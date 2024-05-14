const express = require('express'),
  http = require('http');

const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const bookRouter = require('./routes/bookRouter');
const genreRouter = require('./routes/genreRouter');
const authorRouter = require('./routes/authorRouter');

const hostname = 'localhost';
const port = 3000;

const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use('/dishes', dishRouter);
app.use('/book', bookRouter);
app.use('/genre', genreRouter);
app.use('/author', authorRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});