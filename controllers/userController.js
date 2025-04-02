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

        // Store user session
        req.session.user = {
            UserID: user.UserID,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            Email: user.Email
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