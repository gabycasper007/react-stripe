import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import style from './Menu.module.scss';

const Menu = () => {
  const numberOfProducts = useSelector((state) => state.cart.length);

  return (
    <div className="container">
      <nav>
        <ul className={style.menu}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">
              Cart <span>{numberOfProducts}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
