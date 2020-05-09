import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import style from './Product.module.scss';
import CartButton from '../../atoms/CartButton/CartButton';
import { addToCart } from '../../../store/actions/cartActions';

const Product = ({ product }) => {
  const { id, name, price, image } = product;
  const dispatch = useDispatch();

  return (
    <div className="product">
      <h3>
        #{id} {name}
      </h3>
      <div className={style.price}>Price: S$ {price}</div>
      <img src={image} alt={name} width="250" height="250" />

      <CartButton
        title="Add to cart"
        onClick={() => dispatch(addToCart(product))}
      />
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string
  }).isRequired
};

export default Product;
