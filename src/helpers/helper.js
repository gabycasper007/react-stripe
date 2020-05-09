export const findProductIndex = (products, id) => {
  return products.findIndex((product) => product.id === id);
};

export const roundDecimals = (number, decimals = 2) => {
  return Math.round(number * 10 ** decimals) / 10 ** decimals;
};
