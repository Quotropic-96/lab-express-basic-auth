const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;