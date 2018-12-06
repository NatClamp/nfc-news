const { getUsers } = require('../models/users');

exports.getAllUsers = (req, res, next) => {
  getUsers(req, res, next);
};

exports.getSingleUser = (req, res, next) => {
  getUsers(req, res, next);
};
