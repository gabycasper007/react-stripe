import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';

import './CardSectionStyles.css';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const CARD_ELEMENT_OPTIONS = {
  // For more styling details, see https://stripe.com/docs/js/appendix/style
  style: {
    base: {
      fontSize: 16,
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
};

function CardSection({ isSubmitting, stripe, error, handleChange }) {
  const total = useSelector((state) => state.cart.total);

  return (
    <div className="cardSection">
      {/* 
        You can also use a simpler version of the Stripe form with <CardElement /> 
      */}

      <label>
        Card number
        <CardNumberElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
      </label>
      <label>
        Expiration date
        <CardExpiryElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
      </label>
      <label>
        CVC
        <CardCvcElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleChange}
        />
      </label>
      <button type="submit" disabled={!stripe || isSubmitting}>
        {isSubmitting ? 'Submitting...' : `Pay S$ ${total}`}
      </button>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

CardSection.propTypes = {
  stripe: PropTypes.any,
  isSubmitting: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default CardSection;
