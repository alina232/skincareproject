const ProductType = require("../models/productType");


//get the list of all product types
exports.getProductTypes = async (req, res) => {
    try{
        const productTypes = await ProductType.find();
    
        if (req.session.user) {
            res.render('productTypes', { user: req.session.user,productTypes: productTypes }); // Pass both user and brands data
        } else {
            res.render('productTypes', { user: null, productTypes: productTypes }); // Pass brands data even if user is not logged in
        }
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching product types", 
            error: error.message 
        });
    }
};

//get the details of product type by its id
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


//get details of product type by its name
exports.getProductTypeByName = async (req,res) => {
    try {
        const productTypeName = req.params.name;
        const productType = await ProductType.findOne({ ProductTypeName: { $regex: new RegExp("^" + productTypeName + "$", "i") } });

        if (!productType) {
            return res.status(404).json({ 
                message: "Product type name not found" 
            });
        }

        res.status(200).json(productType);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching product type name", 
            error: error.message 
        });
    }
};