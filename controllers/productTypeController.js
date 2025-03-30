const ProductType = require("../models/productType");

exports.getProductTypes = async (req, res) => {
    try{
        const productTypes = await ProductType.find();
        res.status(200).json(productTypes);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching product types", 
            error: error.message 
        });
    }
};

exports.getProductTypeById = async (req,res) => {
    const { id } = req.params;
        try{
            const productType = await ProductType.findOne({ProductTypeId: id});
            if(!productType){
                return res.status(404).json({
                    message: "Product Type id not found",
                    error: error.message
                });
            }
            res.status(200).json(productType);
        } catch(error) {
            return res.status(500).json({
                message: "Error fetching Product type id",
                error: error.message
            });
        }
};