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
        res.status(200).json(product);
    } catch(error) {
        return res.status(500).json({
            message: "Error fetching Product id",
            error: error.message
        });
    }
};