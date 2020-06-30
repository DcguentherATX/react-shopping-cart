const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');
const port = process.env.PORT || 5000;
const connectionString = process.env.MONGODB_URL;

const app = express();

app.use(bodyParser.json());


app.use('/', express.static(__dirname + '/build'));
app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'));

mongoose.connect(connectionString || 'mongodb://localhost/react-shopping-cart-db', {
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

const Order = mongoose.model('order', new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    email: String,
    name: String,
    address: String,
    total: Number,
    cartItems: [
        {
        _id: String,
        title: String,
        price: Number,
        count: Number
        }
    ],
},
    {
        timestamps: true,
    }
));

app.post('/api/orders', async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.address || !req.body.cartItems ||!req.body.total) {
        return res.send({message: "data is required"});
    }
    const order = await Order(req.body).save();
    res.send(order);
});

app.get('/api/orders', async(req, res) => {
    const orders = await Order.find({});
    res.send(orders);
});

app.delete('/api/orders/:id', async(req, res) => {
    const order = await Order.findByIdAndDelete(req.param.id);
    res.send(order);
})

app.listen(port, () => console.log('server at http://localhost:5000'))