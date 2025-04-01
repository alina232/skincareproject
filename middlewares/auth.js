module.exports = (req, res, next) => {
    if (req.session.user) {
        next(); // User is authenticated, proceed
    } else {
        res.redirect('/login'); // Redirect to login if session is missing
    }
};
