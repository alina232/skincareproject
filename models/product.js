const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },
    Review: {
        type: String,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    ProductId: {
        type: String,
        required: true,
        unique: true
    },
    ProductName: {
        type: String,
        required: true
    },
    BrandID: {
        type: String,
        required: true,
        ref: "Brand"
    },
    ProductTypeId: {
        type: String,
        required: true,
        ref: "ProductType"
    },
    CategoryId: {
        type: String,
        required: true,
        ref: "Category"
    },
    Details: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Reviews: [reviewSchema]
});

module.exports = mongoose.model("Product", productSchema);
