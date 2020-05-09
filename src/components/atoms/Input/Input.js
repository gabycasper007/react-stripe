import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';

const Input = ({
  name,
  label,
  type = 'text',
  required = true,
  id,
  errorClassName,
  inputWrapClassName,
  placeholder,
  errors,
  touched
}) => {
  return (
    <div className={inputWrapClassName || 'inputWrap'}>
      <div className="inputWithLabel">
        <label htmlFor={name}>{label}</label>

        <Field
          type={type}
          id={id || name}
          name={name}
          placeholder={placeholder || label}
          required={required}
          className={
            errors[name] && touched[name]
              ? 'invalid'
              : touched[name]
              ? 'valid touched'
              : 'untouched'
          }
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className={errorClassName || 'error'}
      />
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.string,
  errorClassName: PropTypes.string,
  inputWrapClassName: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.object,
  touched: PropTypes.object
};

export default Input;
