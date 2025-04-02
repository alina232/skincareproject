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
        res.status(200).json({ 
            message: "Product added to cart successfully!" 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error adding product to cart", 
            error: error.message 
        });
    }
};



//get cart items for specified user
exports.getCartItems = async (req, res) => {

    //chek if the user is logged in
    if(!req.session || !req.session.user) {
        return res.status(401).json({
            message: "Please log in"
        });
    }
    console.log("Session Data:", req.session.user);
    //getting userID from session
    const userId = req.session.user.UserID;
    try{
        //get the items on the cart
        const cartItems = await Cart.find({UserID: userId}).lean(); //make a js object from the mongoose objects

        if(!cartItems || cartItems.length === 0){
            return res.status(404).json({
                message: "No items in cart"
            });
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
