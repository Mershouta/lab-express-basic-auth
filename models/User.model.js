const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
