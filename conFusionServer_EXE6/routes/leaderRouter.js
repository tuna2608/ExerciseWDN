const express = require('express');
const bodyParser = require('body-parser');

const leaderRoutes = express.Router();

leaderRoutes.use(bodyParser.json());

leaderRoutes.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader:' 
    +"Id: " +req.body.id
    +'; Name: ' + req.body.name);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
})
.delete((req, res, next) => {
    res.end('Deleting all leader');
});

leaderRoutes.route('/:leadersId')
.get((req,res,next) => {
    res.end('Will send details of the leader: ' + req.params.leadersId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leader/'+ req.params.leadersId);
})
.put((req, res, next) => {
  res.write('Updating the leader: ' + req.params.leadersId + '\n');
  res.end('Will update the leader: ' 
  +"Id: " +req.body.id
  +'; Name: ' + req.body.name);
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leadersId);
});

module.exports = leaderRoutes;