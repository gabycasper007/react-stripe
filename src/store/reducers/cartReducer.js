import {
  ADD_TO_CART,
  CLEAR_CART,
  GET_CART_FROM_STORAGE,
  LOCAL_STORAGE_CART_KEY,
  REMOVE_FROM_CART,
  SUBTRACT_FROM_CART
} from '../actions/types';
import { roundDecimals, findProductIndex } from '../../helpers/helper';

const initialState = {
  products: [],
  length: 0,
  total: 0
};

const cartReducer = (state = initialState, action) => {
  let cart;

  switch (action.type) {
    case GET_CART_FROM_STORAGE:
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
      return initialState;

    case ADD_TO_CART:
      const index = findProductIndex(state.products, action.payload.id);

      if (index > -1) {
        cart = {
          products: state.products.map((product) => {
            if (product.id === action.payload.id) {
              return {
                ...product,
                quantity: product.quantity + 1
              };
            }

            return {
              ...product
            };
          }),

          total: roundDecimals(state.total + action.payload.price),
          length: state.length + 1
        };
      } else {
        cart = {
          products: state.products
            .map((product) => ({ ...product }))
            .concat({
              ...action.payload,
              quantity: 1
            }),
          total: roundDecimals(state.total + action.payload.price),
          length: state.length + 1
        };
      }
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      return cart;

    case SUBTRACT_FROM_CART:
      const products = state.products.map((product) => {
        console.log('zy product', product);
        if (product.id === action.payload.id && product.quantity > 1) {
          product.quantity--;
        }
        return product;
      });

      cart = {
        products,
        total: roundDecimals(state.total - action.payload.price),
        length: products.length
      };
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      return cart;

    case REMOVE_FROM_CART:
      const filteredProducts = state.products.filter(
        (product) => product.id !== action.payload.id
      );
      cart = {
        products: filteredProducts,
        total: roundDecimals(
          state.total - action.payload.quantity * action.payload.price
        ),
        length: filteredProducts.length
      };
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
      return cart;

    case CLEAR_CART:
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
