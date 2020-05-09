import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import style from './CartProduct.module.scss';
import { roundDecimals } from '../../../helpers/helper';
import CartButton from '../../atoms/CartButton/CartButton';
import {
  subtractFromCart,
  addToCart,
  removeFromCart
} from '../../../store/actions/cartActions';

const CartProduct = ({ product }) => {
  const { id, name, quantity, price, image } = product;

  const dispatch = useDispatch();

  return (
    <div className={style.product} key={id}>
      <div className={style.nameAndImage}>
        <img src={image} alt={name} width="100" height="100" />
        <h4>{name}</h4>
      </div>
      <div className="actionables">
        <CartButton
          className="actionable"
          title="+"
          onClick={() => dispatch(addToCart(product))}
        />
        <CartButton
          className="actionable"
          title="-"
          onClick={() => {
            if (quantity > 1) {
              dispatch(subtractFromCart(product));
            }
          }}
        />
        <CartButton
          className="actionable"
          title="X"
          onClick={() => dispatch(removeFromCart(product))}
        />
      </div>

      <div className={style.prices}>
        <span className="quantity">{quantity} x </span>
        <span className="price">S$ {price}</span>
      </div>
      <div className={style.total}>S$ {roundDecimals(price * quantity)}</div>
    </div>
  );
};

CartProduct.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.number,
    image: PropTypes.string
  }).isRequired
};

export default CartProduct;
