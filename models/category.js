const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    CategoryId: {
        type: String,
        required: true,
        unique: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Category", categorySchema);
