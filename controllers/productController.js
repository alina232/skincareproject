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

         // Ensure that reviews are retrieved along with the product
        const reviews = product.Reviews || [];  // Fallback to empty array if no reviews

        // res.render('productDetail', { product , reviews});

        if (req.session.user) {
            res.render('productDetail', { user: req.session.user, product: product, reviews:reviews }); // Pass both user and brands data
        } else {
            res.render('productDetail', { user: null,product: product, reviews:reviews }); // Pass brands data even if user is not logged in
        }
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

//get product details by its brand
exports.getProductsByBrand = async (req, res) => {
    try {
        const { brandId } = req.params; // Extract brandId from URL params
        const products = await Product.find({ BrandID: brandId }); // Find products by brandId

        if (products.length === 0) {
            return res.render('productListing', { message: 'No products found for this brand', brandId });
        }

        // Render the products on the productListing page, passing the products and brandId
        // res.render('productListing', { products, brandId });

        if (req.session.user) {
            res.render('productListing', { user: req.session.user, products: products, brandId: brandId }); // Pass both user and brands data
        } else {
            res.render('productListing', { user: null, products: products, brandId: brandId  }); // Pass brands data even if user is not logged in
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products for the brand',
            error: error.message
        });
    }
};


exports.searchProducts = async (req, res) => {
  const { query } = req.query;  // Retrieve the search query from the URL

  // Check if the query is empty or undefined
  if (!query || query.trim() === "") {
    return res.render("searchResults", {
      message: "Please enter a search term.",
      query: "",
      products: []
    });
  }

  try {
    // Perform case-insensitive search using $regex
    const products = await Product.find({
      ProductName: { $regex: query, $options: 'i' }  // 'i' for case-insensitive search
    });

    // If no products are found
    if (products.length === 0) {
      return res.render("searchResults", {
        message: "No products found matching your search.",
        query: query,
        products: []
      });
    }

    // Render the search results with the products
    res.render("searchResults", {
      products: products,
      query: query
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

//get product list by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Extract brandId from URL params
        const products = await Product.find({ CategoryId: categoryId }); // Find products by brandId

        if (products.length === 0) {
            return res.status(404).json({ 
                message: "No products found for this brand" 
            });
        }
        res.render('productListing', { products, categoryId });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products for the category',
            error: error.message
        });
    }
};

//get product list by product type
exports.getProductsByProductType = async (req, res) => {
    try {
        const { productTypeId } = req.params; 
        const products = await Product.find({ ProductTypeId: productTypeId });

        if (products.length === 0) {
            return res.status(404).json({ 
                message: "No products found for this product type" 
            });
        }
       

        if (req.session.user) {
            res.render('productListing', { user: req.session.user, products: products, productTypeId:productTypeId  }); // Pass both user and brands data
        } else {
            res.render('productListing', { user: null, products: products, productTypeId: productTypeId  }); // Pass brands data even if user is not logged in
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products for the product type',
            error: error.message
        });
    }
};