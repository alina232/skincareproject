const cartSchema = new mongoose.Schema({
    CartId: String,
    UserID: { type: String, ref: 'User' }, // Reference to Users
    ProductId: { type: String, ref: 'Product' }, // Reference to Products
    Quantity: Number,
    TotalPrice: Number
});

module.exports = mongoose.model('Cart', cartSchema);
