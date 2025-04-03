const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    OrderID: { type: String, unique: true },
    UserID: { type: String, ref: 'User' },
    Items: [
        {
            ProductId: { type: String, ref: 'Product' },
            Quantity: Number,
            TotalPrice: Number
        }
    ],
    OrderDate: { type: Date, default: Date.now }
});

orderSchema.pre("save", async function (next) {
    if (!this.OrderID) {
        try {
            const lastOrder = await mongoose.model("Order").findOne().sort({ OrderID: -1 });
            let newId = "O1";

            if (lastOrder && lastOrder.OrderID) {
                let lastIdNumber = parseInt(lastOrder.OrderID.replace("O", "")) || 0;
                newId = `O${lastIdNumber + 1}`;
            }
            this.OrderID = newId;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Order', orderSchema);
