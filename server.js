require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/backend';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión exitosa a MongoDB Atlas');
    })
    .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error));

app.use(session({
    secret: 'mi_sesion-backend',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        ttl: 3600,
    }),
}));

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouter = require('./routes/viewsRouter');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    try {
        const Product = require('./models/Product');
        const products = await Product.find();
        socket.emit('productsUpdated', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }

    socket.on('addProduct', async (productData) => {
        try {
            const Product = require('./models/Product');
            const newProduct = new Product(productData);
            await newProduct.save();

            const updatedProducts = await Product.find();
            io.emit('productsUpdated', updatedProducts);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});