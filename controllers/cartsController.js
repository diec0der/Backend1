const fs = require('fs').promises;
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

const readCartsFile = async () => {
    const data = await fs.readFile(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeCartsFile = async (data) => {
    await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
};

exports.createCart = async (req, res) => {
    const newCart = { id: Date.now().toString(), products: [] };
    const carts = await readCartsFile();
    carts.push(newCart);
    await writeCartsFile(carts);
    res.status(201).json(newCart);
};

exports.getCartById = async (req, res) => {
    const carts = await readCartsFile();
    const cart = carts.find((c) => c.id === req.params.cid);
    if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart.products);
};

exports.addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await readCartsFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
    }

    const productInCart = cart.products.find((p) => p.product === pid);
    if (productInCart) {
    productInCart.quantity += 1;
    } else {
    cart.products.push({ product: pid, quantity: 1 });
    }

    await writeCartsFile(carts);
    res.json(cart);
};