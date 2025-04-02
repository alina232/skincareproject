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