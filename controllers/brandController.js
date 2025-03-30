const Brand = require("../models/brand");

//get all the list of brands
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find(); // Fetch all brands from MongoDB
        res.status(200).json(brands); // Return JSON response
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching brands", 
            error: error.message 
        });
    }
};

//get the details of brand by its id
exports.getBrandById = async (req,res) => {
    const { id } = req.params;
    try{
        const brand = await Brand.findOne({BrandId: id});
        if(!brand){
            return res.status(404).json({
                message: "Brand id not found",
                error: error.message
            });
        }
        res.status(200).json(brand);
    } catch(error) {
        return res.status(500).json({
            message: "Error fetching Brand id",
            error: error.message
        });
    }
};

//get brand details by their name
exports.getBrandByName = async (req, res) => {
    try {
        const brandName = req.params.name;
        const brand = await Brand.findOne({ BrandName: { $regex: new RegExp("^" + brandName + "$", "i") } });

        if (!brand) {
            return res.status(404).json({ 
                message: "Brand not found" 
            });
        }

        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching brand", 
            error: error.message 
        });
    }
};
