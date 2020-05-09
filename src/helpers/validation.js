export const validate = (rules, values) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    if (isRequiredFieldEmpty(rules, field, values)) {
      errors[field] = `${rules[field].label} is required`;
    } else if (isFieldLengthOutOfBoundaries(rules, field, values)) {
      errors[
        field
      ] = `${rules[field].label} must have between ${rules[field].minLength} to ${rules[field].maxLength} characters`;
    } else if (isEmailInvalid(rules, field, values)) {
      errors[field] = `${rules[field].label} must be a valid email address`;
    } else if (isPhoneInvalid(rules, field, values)) {
      errors[field] = `${rules[field].label} must be a valid phone number`;
    } else if (isNumberInvalid(rules, field, values)) {
      errors[field] = `${rules[field].label} must be between 0 and 9`;
    }
  });

  return errors;
};

const isRequiredFieldEmpty = (rules, field, values) =>
  rules[field]?.required && !values[field];

const isFieldLengthOutOfBoundaries = (rules, field, values) =>
  (rules[field].minLength && values[field].length < rules[field].minLength) ||
  (rules[field].maxLength && values[field].length > rules[field].maxLength);

const isEmailInvalid = (rules, field, values) =>
  rules[field]?.type === 'email' &&
  !/^\S+@\S+[.][0-9a-z]+$/.test(values[field]);

const isPhoneInvalid = (rules, field, values) =>
  rules[field]?.type === 'phone' && !/^[0-9()\s-+]+$/.test(values[field]);

const isNumberInvalid = (rules, field, values) =>
  rules[field]?.type === 'number' &&
  (values[field] < rules[field]?.min || values[field] > rules[field]?.max);
