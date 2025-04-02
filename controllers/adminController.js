
exports.adminPanel = (req, res) => {

    res.render('adminHome', {
        user: req.session.user, 
        pageTitle: 'Admin Dashboard'
    });
};
