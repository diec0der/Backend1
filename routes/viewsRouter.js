const express = require('express');
const router = express.Router();
const productManager = require('../managers/productManager');

router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('home', {
        title: 'Home',
        products,
        navbar: '{{> navbar}}',
        footer: '{{> footer}}'
    });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', {
        title: 'Real Time Products',
        products,
        navbar: '{{> navbar}}',
        footer: '{{> footer}}'
    });
});

module.exports = router;