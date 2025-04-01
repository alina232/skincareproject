const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const session = require('express-session');

dotenv.config();

const app = express();
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the path to the views folder

app.use(express.static(path.join(__dirname, 'public')));

//session middleware configuration
app.use(session({
    secret: "6312520ea607f3a7bda833d4", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

//mongoose db connection
mongoose.connect('mongodb://localhost:27017/SkinCareProject1',{useNewUrlParser: true},{useUnifiedTopology: true});
const db = mongoose.connection;

//import controllers
const brandController = require('./controllers/brandController');
const categoryController = require('./controllers/categoryController');
const productTypeController = require('./controllers/productTypeController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

//ROUTES
//BRAND 
app.get('/brands/list',brandController.getBrands);
app.get('/brands/:id', brandController.getBrandById);
app.get('/brands/name/:name', brandController.getBrandByName);

//CATEGORY 
app.get('/categories/list', categoryController.getCategories);
app.get('/categories/:id', categoryController.getCategoryById);
app.get('/categories/name/:name', categoryController.getCategoryByName);

//PRODUCT TYPES
app.get('/product-types/list', productTypeController.getProductTypes);
app.get('/product-types/:id', productTypeController.getProductTypeById);
app.get('/product-types/name/:name', productTypeController.getProductTypeByName);

//PRODUCT 
app.get('/products/list', productController.getProducts);
app.get('/products/:id', productController.getProductById);
app.get('/products/name/:name', productController.getProductByName);
// app.get('/products/brand/:brandId', productController.getProductsByBrand);

app.get('/brand/:brandId/products', productController.getProductsByBrand);
app.get('/categories/:categoryId/products', productController.getProductsByCategory);
app.get('/product-types/:productTypeId/products', productController.getProductsByProductType);


//HOMEPAGE AND SEARCH
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/search', productController.searchProducts);


//USER AUTHENTICATION ROUTES
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.get('/logout', userController.logout);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});