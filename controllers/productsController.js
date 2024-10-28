const fs = require('fs').promises;
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');

const readProductsFile = async () => {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeProductsFile = async (data) => {
    await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
};

exports.getAllProducts = async (req, res) => {
    try {
    const { limit } = req.query;
    const products = await readProductsFile();

    if (limit && !isNaN(limit)) {
        return res.json(products.slice(0, Number(limit)));
    }
    res.json(products);
    } catch (error) {
    res.status(500).json({ error: 'Error al leer los productos' });
    }
};

exports.getProductById = async (req, res) => {
    try {
    const products = await readProductsFile();
    const product = products.find((p) => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
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

    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails
    };

    const products = await readProductsFile();
    products.push(newProduct);
    await writeProductsFile(products);
    res.status(201).json(newProduct);
    } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
    const { pid } = req.params;
    const updates = req.body;

    const products = await readProductsFile();
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...updates, id: products[productIndex].id };
    await writeProductsFile(products);
    res.json(products[productIndex]);
    } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
    const products = await readProductsFile();
    const updatedProducts = products.filter((p) => p.id !== req.params.pid);
    await writeProductsFile(updatedProducts);
    res.status(204).send();
    } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};