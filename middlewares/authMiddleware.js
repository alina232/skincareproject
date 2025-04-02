module.exports = {
    // Middleware to check if the user is an admin
    checkAdmin: (req, res, next) => {
        // Check if user is logged in and has the 'isAdmin' flag
        if (!req.session.user || !req.session.user.isAdmin) {
            // If not an admin, redirect to a page or send a forbidden response
            return res.redirect("/login");
        }

        // If user is an admin, allow them to proceed
        next(); // Proceed to the next middleware or route handler
    }
};
