import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import CartProduct from '../../molecules/CartProduct/CartProduct';
import style from './Cart.module.scss';
import CartButton from '../../atoms/CartButton/CartButton';
import { clearCart } from '../../../store/actions/cartActions';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="container">
      <h1>Cart</h1>

      {!cart.length ? (
        <div>Cart is empty</div>
      ) : (
        <>
          <div className={style.products}>
            {cart.products.map((product) => (
              <CartProduct key={product.id} product={product} />
            ))}
          </div>

          <div className={style.cartLastRow}>
            <div className="clearCart">
              <CartButton
                title="Clear cart"
                onClick={() => dispatch(clearCart())}
              />
            </div>

            <div className={style.totals}>
              <div>Total: S$ {cart.total}</div>
              <NavLink to="/checkout" exact className="button">
                Checkout
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
