const express = require('express');
const bodyParser = require('body-parser');

const authorRoutes = express.Router();

authorRoutes.use(bodyParser.json());

authorRoutes.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the authors to you!');
})
.post((req, res, next) => {
    res.end('Will add the author:' 
    +"Id: " +req.body.id
    +'; Name: ' + req.body.name);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /author');
})
.delete((req, res, next) => {
    res.end('Deleting all author');
});

authorRoutes.route('/:authorsId')
.get((req,res,next) => {
    res.end('Will send details of the author: ' + req.params.authorsId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /author/'+ req.params.authorsId);
})
.put((req, res, next) => {
  res.write('Updating the author: ' + req.params.authorsId + '\n');
  res.end('Will update the author: ' 
  +"Id: " +req.body.id
  +'; Name: ' + req.body.name);
})
.delete((req, res, next) => {
    res.end('Deleting author: ' + req.params.authorsId);
});

module.exports = authorRoutes;