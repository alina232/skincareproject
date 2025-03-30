const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the path to the views folder

app.use(express.static(path.join(__dirname, 'public')));

//mongoose db connection
mongoose.connect('mongodb://localhost:27017/SkinCareProject1',{useNewUrlParser: true},{useUnifiedTopology: true});
const db = mongoose.connection;

//import controllers
const brandController = require('./controllers/brandController');
const categoryController = require('./controllers/categoryController');
const productTypeController = require('./controllers/productTypeController');
const productController = require('./controllers/productController');

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

app.get('/', (req, res) => {
    res.render('index'); // This will render views/index.ejs
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});