const Product = require('../models/product'); 
const Category = require('../models/category'); 
const Brand = require('../models/brand');
const ProductType = require('../models/productType');

//get dashboard page
exports.adminPanel = (req, res) => {

    res.render('adminHome', {
        user: req.session.user, 
        pageTitle: 'Admin Dashboard'
    });
};

//get products list 
exports.viewProducts = async (req, res) => {
    try {
        const products = await Product.find();  // Fetch products

        // Manually fetch brand, product type, and category using their string IDs
        const populatedProducts = await Promise.all(
            products.map(async (product) => {
                const brand = await Brand.findOne({ BrandId: product.BrandID }).lean();
                const productType = await ProductType.findOne({ ProductTypeId: product.ProductTypeId }).lean();
                const category = await Category.findOne({ CategoryId: product.CategoryId }).lean();

                return {
                    ...product.toObject(),
                    BrandName: brand ? brand.BrandName : "Unknown Brand",
                    ProductTypeName: productType ? productType.ProductTypeName : "Unknown Product Type",
                    CategoryName: category ? category.CategoryName : "Unknown Category"
                };
            })
        );

        res.render('admin/viewProducts', { products: populatedProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


//get product form page
exports.getProductForm = async (req, res) => {
    try {
        const brands = await Brand.find().lean();
        const productTypes = await ProductType.find().lean();
        const categories = await Category.find().lean();

        res.render("admin/addProduct", { brands, productTypes, categories });
    } catch (error) {
        res.status(500).json({ message: "Error loading product form", error: error.message });
    }
};


//add the product details in the product db
exports.addNewProduct = (req, res) => {
    req.upload.single("Image")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading file", error: err.message });
        }

        try {
            const { ProductId, ProductName, BrandID, ProductTypeId, CategoryId, Details, Price } = req.body;

            if (!ProductId || !ProductName || !BrandID || !ProductTypeId || !CategoryId || !Details || !Price) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const imagePath = req.file ? `/images/${req.file.filename}` : "";

            const newProduct = new Product({
                ProductId,
                ProductName,
                BrandID,
                ProductTypeId,
                CategoryId,
                Details,
                Price,
                Image: imagePath,
            });

            await newProduct.save();
            res.redirect("/admin/products");
        } catch (error) {
            res.status(500).json({ 
                message: "Error occurred while adding new product", 
                error: error.message 
            });
        }
    });
};

//get the edit product page
exports.getEditProductForm = async (req,res) => {
    try{
        const product = await Product.findOne({ ProductId: req.params.id }).lean();
        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const brands = await Brand.find().lean();
        const categories = await Category.find().lean();
        const productTypes = await ProductType.find().lean();

        res.render("admin/editProduct", { product, brands, categories, productTypes});
    }catch(error){
        res.status(500).json({ 
            message: "Error occurred while fetching product details", 
            error: error.message 
        });
    }
};

//update the product details
exports.updateProduct = async (req, res) => {
    req.upload.single("Image")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ 
                message: "Error uploading file", 
                error: err.message 
            });
        }

        try {
            const { ProductName, BrandID, ProductTypeId, CategoryId, Details, Price } = req.body;
            const productId = req.params.id;

            let updateData = {
                ProductName,
                BrandID,
                ProductTypeId,
                CategoryId,
                Details,
                Price,
            };

            // If a new image was uploaded, update image path
            if (req.file) {
                updateData.Image = `/images/${req.file.filename}`;
            }

            const updatedProduct = await Product.findOneAndUpdate(
                { ProductId: productId },
                updateData,
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.redirect("/admin/products");
        } catch (error) {
            res.status(500).json({ message: "Error updating product", error: error.message });
        }
    });
};

// delete the product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findOneAndDelete({ ProductId: productId });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.redirect("/admin/products");
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while deleting the product",
            error: error.message
        });
    }
};



//get all the brand list
exports.viewBrands = async (req, res) => {
     try{
        const brands = await Brand.find().lean();
        res.render("admin/viewBrands", { brands });
     }catch(error){
        res.status(500).json({
            message: "Error fetching brands",
            error: error.message
        });
     }
};

//get the add new brands page
exports.getBrandForm = async (req, res) => {
    const brands = await Brand.find().lean();
    res.render("admin/addBrand", { brands});
};

// add the brand details in the brand db
exports.addNewBrand = (req, res) => {
    req.upload.single("Image")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading file", error: err.message });
        }

        try {
            const { BrandId, BrandName, BrandDetails } = req.body;

            if (!BrandId || !BrandName || !BrandDetails) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const imagePath = req.file ? `/images/${req.file.filename}` : "";

            const newBrand = new Brand({
                BrandId,
                BrandName,
                BrandDetails,
                Image: imagePath,
            });

            await newBrand.save();
            res.redirect("/admin/brands");
        } catch (error) {
            res.status(500).json({ 
                message: "Error occurred while adding new brand", 
                error: error.message 
            });
        }
    });
};


//get edit brand page
exports.getEditBrandForm = async (req, res) => {
    try{
        const brand = await Brand.findOne({ BrandId: req.params.id }).lean();
        if(!brand) {
            return res.status(404).json({
                message: "Brand not found"
            });
        }
        res.render("admin/editBrand", { brand });
    }catch(error){
        res.status(500).json({
            message: "Error fetching the brand details",
            error: error.message
        });
    }
};

//update the brand details
exports.updateBrand = async (req, res) => {
    req.upload.single("Image")(req,res, async (err) => {
        if(err){
            return res.status(500).json({
                message: "Error uploading file",
                error: err.message
            });
        }
        try{

            const { BrandName, BrandDetails } = req.body;
            const brandId = req.params.id;
            let updateData = {
                BrandName,
                BrandDetails
            };

            //check if new image is uploaded
            if(req.file){
                updateData.Image = `/images/${req.file.filename}`;
            }

            const updatedBrand = await Brand.findOneAndUpdate(
                {BrandId: brandId},
                updateData,
                { new: true }
            );

            if(!updatedBrand) {
                return res.status(404).json({
                    message: "Brand not found"
                });
            }
            res.redirect("/admin/brands");
        }catch(error){
            res.status(500).json({
                message: "Error updating brand deetails",
                error: error.message
            });
        }
    });
};

// delete the brand
exports.deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id;
        
        // Delete the brand
        const deletedBrand = await Brand.findOneAndDelete({ BrandId: brandId });

        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        res.redirect("/admin/brands");
    } catch (error) {
        res.status(500).json({
            message: "Error occurred while deleting the brand",
            error: error.message
        });
    }
};
