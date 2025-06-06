const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone:{type:String,required:true},
  email: { type: String, required:true, unique: true},
  password: { type: String, required: true },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],twoFACode: {
    type: String,
  },
  ResetCode: {
    type: String,
  },
  ResetCodeExpire: {
    type: Date,
  },
  twoFACodeExpires: {
    type: Date,
  },
});

module.exports = mongoose.model('User', UserSchema);