const productsFromDB = require('../constants/products');

const calculateTotal = (products) => {
  return roundDecimals(
    products.reduce(
      (acc, elem) =>
        acc +
        elem.quantity * productsFromDB.find((p) => p.id === elem.id).price,
      0
    )
  );
};

const roundDecimals = (number, decimals = 2) => {
  return Math.round(number * 10 ** decimals) / 10 ** decimals;
};

module.exports = calculateTotal;
