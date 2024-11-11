const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const handlebars = require('express-handlebars');
const path = require('path');
const ProductManager = require('./managers/productManager');

const productManager = new ProductManager();

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const productsRouter = require('./routes/productsRouter');
const cartsRouter = require('./routes/cartsRouter');
const viewsRouter = require('./routes/viewsRouter');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    try {
        const products = await productManager.getAllProducts();
        socket.emit('productsUpdated', products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }

    socket.on('addProduct', async (productData) => {
        try {
            await productManager.addProduct(productData);

            const updatedProducts = await productManager.getAllProducts();
            io.emit('productsUpdated', updatedProducts);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});