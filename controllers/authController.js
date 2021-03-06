const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

function register(req, res, next) {
  User
    .create(req.body)
    .then(() => res.json({ message: 'Registration successful' }))
    .catch(next);
}

function login(req, res, next) {
  // console.log('this all of req.body', req.body);
  User
    .findOne({ email: req.body.email }) //had to change this from user to userName to work.
    //Change back if this causes problems in the future.
    .then(user => {
      // console.log('this is the user we found', user);
      if(!user || !user.validatePassword(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorised or User not found, please try again!' });
      }
      // USER IS AUTHENTICATED
      const token = jwt.sign({ sub: user.id, admin: false, firstName: user.firstName}, secret, { expiresIn: '1hr' });
      // console.log('Created token!!', token);
      return res.json({ message: `Welcome back ${user.id}. Where's the party today?`, token });
    })
    .catch(next);
}


module.exports = {
  register,
  login
};
