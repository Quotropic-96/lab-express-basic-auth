const router = require("express").Router();

router.get('/', (req, res, next) => {
    res.render('private');
})

module.exports = router;