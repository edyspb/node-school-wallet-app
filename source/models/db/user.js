const mongoose = require('mongoose');

const User = mongoose.model('User', {
  id: {
    type: Number,
    required: true
  },
  default_email: {
    type: String,
    validate: {
      validator(value) {
        const isValid =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
        return isValid;
      },
      message: '{VALUE} is not a valid email!'
    },
    required: [true, 'email required']
  },
  display_name: {
    type: String,
    required: true
  },
  sex: {
    type: String,
  },
});

module.exports = User;
