const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    CartID: {type: String, unique: true},
    UserID: { type: String, ref: 'User' }, // Reference to Users
    ProductId: { type: String, ref: 'Product' }, // Reference to Products
    Quantity: Number,
    TotalPrice: Number
});

cartSchema.pre("save", async function (next){
    if(!this.CartID) {
        try{
        const lastCart = await mongoose.model("Cart").findOne().sort({ CartID: -1 });
        let newId = "CI1";

        if(lastCart && lastCart.CartID ) {
            let lastIdNumber = parseInt(lastCart.CartID.replace("CI", ""))||0;
            newId = `CI${lastIdNumber + 1}`;
        }
        this.CartID = newId;
        next();
        } catch(error){
            next(error);
        }
    } else{
        next();
    }
});


module.exports = mongoose.model('Cart', cartSchema);
