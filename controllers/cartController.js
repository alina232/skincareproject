const Cart = require('../models/cart');
const Product = require('../models/product');

//add items to cart
exports.addItemToCart = async (req,res) => {
    try{
        const { productId, quantity } = req.body;
        const userId = req.session.user.UserID;

        //check if user is logged in
        if(!userId) {
            return res.status(401).json({
                message: "Log in to add product to cart"
            });
        }
        //get product details
        const product = await Product.findOne({ProductId: productId});
        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        //calculate total price
        const totalPrice = product.Price * quantity;
        //check if product is already in cart
        let inCartItem = await Cart.findOne({ UserID: userId, ProductId: productId});

        if(inCartItem) {
            inCartItem.Quantity += parseInt(quantity);
            inCartItem.TotalPrice = inCartItem.Quantity * product.Price;
            await inCartItem.save();
        } else{
            //add new cart item
            const newCartItem = new Cart({ 
                UserID: userId,
                ProductId: productId,
                Quantity: parseInt(quantity),
                TotalPrice: totalPrice
            });

            await newCartItem.save();
        }
        res.status(200).json({ message: "Product added to cart successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
};


