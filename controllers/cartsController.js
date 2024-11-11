const cartManager = require('../managers/cartManager');

exports.createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el carrito' });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
};