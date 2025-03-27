const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
    ProductTypeId: {
        type: String,
        required: true,
        unique: true
    },
    CategoryId: {
        type: String,
        required: true,
        ref: "Category"
    },
    ProductTypeName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("ProductType", productTypeSchema);
