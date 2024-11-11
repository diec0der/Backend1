const fs = require('fs').promises;
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

class CartManager {
    async createCart() {
        const carts = await this._readCartsFile();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await this._writeCartsFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readCartsFile();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this._readCartsFile();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const product = cart.products.find(p => p.product === productId);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this._writeCartsFile(carts);
        return cart;
    }

    async _readCartsFile() {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    async _writeCartsFile(data) {
        await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
    }
}

module.exports = new CartManager();