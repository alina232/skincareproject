const User = require("../models/users");
const bcrypt = require("bcryptjs");

//user signup
exports.signup = async (req, res) => {
    try {
        const { Firstname, Lastname, Email, Password, Address, Contact } = req.body;

        //check if user already exists with the email
        const userCheck = await User.findOne({ Email });
        if (userCheck) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        //hash the password before saving
        const hashPassword = await bcrypt.hash(Password, 10);

        //creating new user and save to db
        const newUser = new User({ Firstname, Lastname, Email, Password: hashPassword, Address, Contact });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while signup",
            error: error.message
        });
    }
};

//user login
exports.login = async (req, res) => {
    try {
        //get user email and password from request body
        const { Email, Password } = req.body;

        // Check if user exists
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }

        // Check if the email is for the admin
        if (Email === 'admin@gmail.com' && Password === 'admin') {
            req.session.user = {
                Email: 'admin@gmail.com',
                Firstname: user.Firstname,
                Lastname: user.Lastname,
                Email: user.Email,
                isAdmin: true
            };

            return res.json({
                success: true,
                redirectUrl: "/admin"  // Redirect to the admin dashboard
            });
        }

        // Store user session
        req.session.user = {
            UserID: user.UserID,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            Email: user.Email, 
            isAdmin: false
        };

        // Save session before redirecting
        req.session.save((err) => {
            if (err) {
                return res.status(500).json({ message: "Session saving failed" });
            }
            res.json({ 
                success: true, 
                redirectUrl: "/"  
            });
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: "Login failed", 
            error: error.message 
        });
    }
};

//user logout
exports.logout = (req, res) => {
    if(req.session.user){
        //save the details of user before destroying session
        const loggedOutUser = req.session.user;

        req.session.destroy((error) => {
            if (error) {
                return res.status(500).json({ 
                    message: "Logout failed", 
                    error: error.message 
                });
            }
           res.redirect('/');
        });
    } else {
        res.status(400).json({
            message : "No user is logged in"
        });
    }
};

//get user details by its id
exports.getUserById = async (req,res) => {
    try{
        const { id } = req.params;
        const user = await User.findOne({ UserID: id });
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json(user);
    }catch(error){
        return res.status(500).json({ 
            message: "Error fetching user details", 
            error: error.message 
        });
    }
};

// controllers/userController.js

exports.showUpdateForm = (req, res) => {
    const user = req.session.user;  // Get user data from the session
    // if (!user) {
    //       // Redirect to login if the user is not logged in
    // }

    if (req.session.user) {
        res.render('updateUser', { user: req.session.user, user: user }); // Pass both user and brands data
    } else {
        return res.redirect('/login'); // Pass brands data even if user is not logged in
    }
    // // Render the update profile form with user data
    // res.render('updateUser', { user: user });
};



exports.updateProfile = async (req, res) => {
    try {
        const { UserID } = req.session.user;  // Get user ID from session
        const { Firstname, Lastname, Email, Address, Contact } = req.body;  // Get new data from the form

        // Find the user by their UserID
        const user = await User.findOne({ UserID });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details with the new data
        user.Firstname = Firstname;
        user.Lastname = Lastname;
        user.Email = Email;
        user.Address = Address;
        user.Contact = Contact;

        // Save the updated user to the database
        await user.save();

        // Send a success message and redirect to the profile page (or another route)
        res.redirect('/updateUser');  // Redirect to profile page after update
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};