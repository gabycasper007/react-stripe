import React from 'react';
import PropTypes from 'prop-types';

const CartButton = ({ onClick, title, className = '' }) => {
  return (
    <button type="button" className={className} onClick={onClick}>
      {title}
    </button>
  );
};

CartButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default CartButton;
