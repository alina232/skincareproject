const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/orders');

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
        res.status(200).json({ 
            message: "Product added to cart successfully!" 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "You must be logged in to add to my cart", 
            error: error.message 
        });
    }
};



//get cart items for specified user
exports.getCartItems = async (req, res) => {

    //chek if the user is logged in
    if(!req.session || !req.session.user) {
        return res.render('login');
    }
    console.log("Session Data:", req.session.user);
    //getting userID from session
    const userId = req.session.user.UserID;
    try{
        //get the items on the cart
        const cartItems = await Cart.find({UserID: userId}).lean(); //make a js object from the mongoose objects

        if(!cartItems || cartItems.length === 0){
            return res.render("cart", {
                user: req.session.user,
                message: "No items in cart",
                totalAmount: 0,
                cartItems: [],

            })
        }

        // Fetch product details manually using ProductId (string-based)
        const productIds = cartItems.map(item => item.ProductId);
        const products = await Product.find({ ProductId: { $in: productIds } }).lean();

        console.log("Products:", products);
        console.log("Cart Items:", cartItems);

           // Merge product details with cart items
        const cartWithProducts = cartItems.map(item => {
            const product = products.find(prod => prod.ProductId === item.ProductId);
            console.log('Matching product for cart item:', item.ProductId, product); // Log this for debugging
            return {
                ...item,
                ProductDetails: product || {} // Ensure we get an empty object if no match is found
            };
        });

        //calculate the total amount by adding all totalPrice
        const totalAmount = cartItems.reduce((sum,item) => sum + (item.TotalPrice || 0), 0);

        // res.status(200).json({
        //     message: "Cart items fetched successfully",
        //     totalAmount,
        //     cartItems
        // });
        if (req.session.user) {
            res.render('cart', { user: req.session.user, totalAmount: totalAmount, cartItems: cartWithProducts }); 
        } else {
            res.render('login'); 
        }
    } catch(error){
        return res.status(500).json({
            message: "Error fetching cart items",
            error: error.message
        });
    }
};

exports.decreaseCartItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user.UserID;

        // Check if user is logged in
        if (!userId) {
            return res.redirect("/login"); // Redirect to login if not authenticated
        }

        // Find the cart item
        let cartItem = await Cart.findOne({ UserID: userId, ProductId: productId });

        if (!cartItem) {
            return res.redirect("/cart");
        }

        // Decrease quantity
        cartItem.Quantity -= 1;
        cartItem.TotalPrice = cartItem.Quantity * (await Product.findOne({ ProductId: productId })).Price;

        // Remove item if quantity is 0
        if (cartItem.Quantity <= 0) {
            await Cart.deleteOne({ UserID: userId, ProductId: productId });
        } else {
            await cartItem.save();
        }

        res.redirect("/cart"); // Refresh the cart page after updating

    } catch (error) {
        console.error("Error updating cart item:", error);
        res.redirect("/cart");
    }
};

exports.payWithVisa = async (req, res) => {
    try {
        // Check if the user is authenticated by verifying the session
        const userId = req.session.user ? req.session.user.UserID : null;

        if (!userId) {
            // If not authenticated, return a 401 Unauthorized response
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Fetch cart items for the authenticated user
        const cartItems = await Cart.find({ UserID: userId });

        if (cartItems.length === 0) {
            // If the cart is empty, return a 400 Bad Request response
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // Create a new order from the cart items
        const newOrder = new Order({
            UserID: userId,
            Items: cartItems.map(item => ({
                ProductId: item.ProductId,
                Quantity: item.Quantity,
                TotalPrice: item.TotalPrice
            })),
            TotalAmount: cartItems.reduce((sum, item) => sum + item.TotalPrice, 0) // Calculate the total amount
        });

        // Save the new order to the database
        await newOrder.save();

        // After the order is placed, clear the user's cart
        await Cart.deleteMany({ UserID: userId });

        // Return a success response indicating the order was placed successfully
        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        // If any error occurs during the process, log the error and return a 500 Internal Server Error response
        console.error("Error processing order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
