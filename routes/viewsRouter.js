const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

router.use(async (req, res, next) => {
    if (!req.session.cartId) {
        const newCart = await Cart.create({ products: [] });
        req.session.cartId = newCart._id.toString();
    }
    res.locals.cartId = req.session.cartId;
    next();
});

router.get('/', async (req, res) => {
    try {
        const { limit = 5, page = 1 } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
        };

        const products = await Product.paginate({}, options);

        res.render('home', {
            title: 'Inicio',
            payload: products.docs,
            cartId: res.locals.cartId,
            page: products.page,
            totalPages: products.totalPages,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/?page=${products.nextPage}&limit=${limit}` : null,
        });
    } catch (error) {
        console.error('Error al cargar la página principal:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await Product.findById(productId);

        if (!product) return res.status(404).send('Producto no encontrado');

        res.render('productDetails', {
            title: 'Detalle del Producto',
            product,
            cartId: res.locals.cartId,
        });
    } catch (error) {
        console.error('Error al cargar el detalle del producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products, cartId: res.locals.cartId }); // Pasar cartId
    } catch (error) {
        console.error('Error al cargar productos en tiempo real:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.findById(res.locals.cartId).populate('products.product');
        res.render('cart', { title: 'Carrito de Compras', cart });
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;