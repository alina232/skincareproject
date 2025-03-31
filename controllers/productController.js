const Product = require("../models/product");

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); 
        res.status(200).json(products); 
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching products", 
            error: error.message 
        });
    }
};

exports.getProductById = async (req,res) => {
    const { id } = req.params;
    try{
        const product = await Product.findOne({ProductId: id});
        if(!product){
            return res.status(404).json({
                message: "Product id not found",
                error: error.message
            });
        }
        res.render('productDetail', { product });
    } catch(error) {
        return res.status(500).json({
            message: "Error fetching Product id",
            error: error.message
        });
    }
};

//get product details by its name
exports.getProductByName = async (req, res) => {
    try {
        const productName = req.params.name;
        const product = await Product.findOne({ ProductName: { $regex: new RegExp("^" + productName + "$", "i") } });

        if (!product) {
            return res.status(404).json({ 
                message: "Product name not found" 
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching product name", 
            error: error.message 
        });
    }
};


exports.getProductsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params; // Extract brandId from URL params
        const products = await Product.find({ BrandID: brandId }); // Find products by brandId

        if (products.length === 0) {
            return res.render('productListing', { message: 'No products found for this brand', brandId });
        }

        // Render the products on the productListing page, passing the products and brandId
        res.render('productListing', { products, brandId });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products for the brand',
            error: error.message
        });
    }
};
