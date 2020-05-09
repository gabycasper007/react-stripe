export const checkoutInitialValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  zip: ''
};

export const checkoutRules = {
  name: {
    label: 'Name',
    required: true,
    minLength: 2,
    maxLength: 30
  },
  email: {
    label: 'Email',
    required: true,
    type: 'email',
    minLength: 6,
    maxLength: 255
  },
  phone: {
    label: 'Phone number',
    required: true,
    type: 'phone',
    minLength: 4,
    maxLength: 15
  },
  address: {
    label: 'Address',
    required: true,
    minLength: 10,
    maxLength: 60
  },
  zip: {
    label: 'Zip',
    required: true,
    minLength: 5,
    maxLength: 7
  }
};
