const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

//mongoose db connection
mongoose.connect('mongodb://localhost:27017/SkinCareProject',{useNewUrlParser: true},{useUnifiedTopology: true});
const db = mongoose.connection;

//routes


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});