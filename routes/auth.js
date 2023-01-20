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
});

/* GET login page */
router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

/* POST log in */
router.post('/login/:originalUrl', async (req, res, next) => {
    const { username, password } = req.body;
    const { originalUrl } = req.params;
    if (!username || !password) {
        res.render('auth/login', {error: 'All fields must be provided'});
        return;
    }
    try {
        const userInDB = await User.findOne({ username: username});
        if (!userInDB) {
            res.render('auth/login', { error: `${username} does not exist`});
            return;
        }
        const passwordMatch = await bcrypt.compare(password, userInDB.hashedPassword);
        if (passwordMatch) {
            req.session.currentUser = userInDB;
            if (originalUrl) {
                res.redirect('/' + originalUrl);
            } else {
                res.render('user/profile', userInDB);
            }
        } else {
            res.render('auth/login', {error: 'Unable to authenticate'})
        }
    } catch (error) {
        next(error);
    }
})

/* GET logout */
router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err)
      } else {
        res.clearCookie('show-app')
        res.redirect('/auth/login');
      }
    });
  });

module.exports = router;