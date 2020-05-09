import {
  ADD_TO_CART,
  GET_CART_FROM_STORAGE,
  CLEAR_CART,
  SUBTRACT_FROM_CART,
  REMOVE_FROM_CART
} from './types';

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
});

export const subtractFromCart = (product) => ({
  type: SUBTRACT_FROM_CART,
  payload: product
});

export const removeFromCart = (product) => ({
  type: REMOVE_FROM_CART,
  payload: product
});

export const getCartFromStorage = () => ({
  type: GET_CART_FROM_STORAGE
});

export const clearCart = () => ({
  type: CLEAR_CART
});
