const express = require('express');
const bodyParser = require('body-parser');

const promoRoutes = express.Router();

promoRoutes.use(bodyParser.json());

promoRoutes.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promos to you!');
})
.post((req, res, next) => {
    res.end('Will add the promo:' 
    +"Id: " +req.body.id
    +'; Name: ' + req.body.name);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promo');
})
.delete((req, res, next) => {
    res.end('Deleting all promo');
});

promoRoutes.route('/:promosId')
.get((req,res,next) => {
    res.end('Will send details of the promo: ' + req.params.promosId +' to you!');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promo/'+ req.params.promosId);
})
.put((req, res, next) => {
  res.write('Updating the promo: ' + req.params.promosId + '\n');
  res.end('Will update the promo: ' 
  +"Id: " +req.body.id
  +'; Name: ' + req.body.name);
})
.delete((req, res, next) => {
    res.end('Deleting promo: ' + req.params.promosId);
});

module.exports = promoRoutes;