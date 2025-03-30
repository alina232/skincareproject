const Category = require("../models/category");

//get the list of all categories
exports.getCategories = async (req, res) => {
       try {
           const categories = await Category.find(); 
           res.status(200).json(categories); // Return JSON response
       } catch (error) {
           res.status(500).json({ 
               message: "Error fetching categories", 
               error: error.message 
           });
       }

};


//get details of a category by its id
exports.getCategoryById = async (req,res) => {
    const { id } = req.params;
    try{
        const category = await Category.findOne({ CategoryId: id});
        if(!category){
            return res.status(404).json({
                message: "Category id not found",
                error: error.message
            });
        }
        res.status(200).json(category);
    } catch(error) {
        return res.status(500).json({
            message: "Error fetching Category id",
            error: error.message
        });
    }
};

//get category details by their name
exports.getCategoryByName = async (req, res) => {
    try {
        const categoryName = req.params.name;
        const category = await Category.findOne({ CategoryName: { $regex: new RegExp("^" + categoryName + "$", "i") } });

        if (!category) {
            return res.status(404).json({ 
                message: "Category name not found" 
            });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching category name", 
            error: error.message 
        });
    }
};