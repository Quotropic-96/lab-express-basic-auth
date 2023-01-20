const router = require("express").Router();
const isLoggedIn = require('../middlewares');

router.get('/', isLoggedIn, (req, res, next) => {
    res.render('private');
})

module.exports = router;