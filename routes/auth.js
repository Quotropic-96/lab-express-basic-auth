const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');

/* GET signup page */
/* ROUTE /auth/signup */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/* POST sign up Page */
router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup', { error: 'All fields are necessary'});
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.render('auth/signup', { error: 'Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.' });
        return;
    }
    try {
        const userInDB = await User.findOne({ username: username});
        if (userInDB) {
            res.render('auth/signup', { error: "There is already one user with this username"});
            return;
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, hashedPassword});
        res.render('user/profile', newUser);
    } catch (error) {
        next(error);
    }
})

module.exports = router;