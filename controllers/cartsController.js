const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            console.error(`Carrito con ID ${req.params.cid} no encontrado`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

exports.addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;

    console.log('ID del carrito (cid):', cid);
    console.log('ID del producto (pid):', pid);

    if (!cid || !pid) {
        console.error('Faltan el ID del carrito o el producto');
        return res.status(400).json({ error: 'ID del carrito o del producto faltante en la solicitud.' });
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            console.error(`Carrito con ID ${cid} no encontrado`);
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            console.error(`Producto con ID ${pid} no encontrado`);
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        console.log(`Producto ${pid} agregado al carrito ${cid}`);
        res.json(cart);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error); // Registro
        res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
    }
};

exports.removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
};

exports.clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.json({ message: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
};