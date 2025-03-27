const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    BrandId: {
        type: String,
        required: true,
        unique: true
    },
    BrandName: {
        type: String,
        required: true
    },
    BrandDetails: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Brand", brandSchema);
