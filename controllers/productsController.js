const productManager = require('../managers/productManager');

exports.getAllProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los productos' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el producto' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
        }

        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};