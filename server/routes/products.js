const express = require('express');
const productsFromDB = require('../constants/products');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).json({
    products: productsFromDB
  });
});

module.exports = router;
