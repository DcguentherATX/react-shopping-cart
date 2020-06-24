const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');
const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/react-shopping-cart-db', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const Product = mongoose.model('products', new mongoose.Schema({
    _id: {type: String, default: shortid.generate},
    image: String,
    title: String,
    description: String,
    availableSizes: [String],
    price: Number
}))

app.get('/api/products', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
});

app.delete('/api/products/:id', async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
})

app.listen(port, () => console.log('server at http://localhost:5000'))