const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: String,
    Firstname: String,
    Lastname: String,
    Email: { type: String, unique: true },
    Password: String, // Hash before storing
    Address: String,
    Contact: String
});

module.exports = mongoose.model('User', userSchema);
