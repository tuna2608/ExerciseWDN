const express = require('express');
const bodyParser = require('body-parser');

const bookRoutes = express.Router();

bookRoutes.use(bodyParser.json());

bookRoutes.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the books to you!');
})
.post((req, res, next) => {
    res.end('Will add the book:' 
    +"Title: " +req.body.title
    +';Description: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /book');
})
.delete((req, res, next) => {
    res.end('Deleting all book');
});

bookRoutes.route('/:booksId')
.get((req,res,next) => {
    res.end('Will send details of the book: ' + req.params.booksId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /book/'+ req.params.booksId);
})
.put((req, res, next) => {
  res.write('Updating the book: ' + req.params.booksId + '\n');
  res.end('Will update the book: ' +"Title: " +req.body.title
  +'; Description: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting book: ' + req.params.booksId);
});

module.exports = bookRoutes;