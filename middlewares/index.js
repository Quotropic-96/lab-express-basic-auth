module.exports = isLoggedIn = (req, res, next) => {
    if (!req.session.currentUser) {
        const originalUrl = req._parsedOriginalUrl.href.replace('/','');
        res.render('auth/login', { indication: 'You need to be logged in to see this content', originalUrl});
    } else {
        next();
    }
  };