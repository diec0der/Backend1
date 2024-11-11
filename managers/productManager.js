const fs = require('fs').promises;
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');

class ProductManager {
    async getAllProducts(limit) {
        const products = await this._readProductsFile();
        return limit ? products.slice(0, Number(limit)) : products;
    }

    async getProductById(id) {
        const products = await this._readProductsFile();
        return products.find(product => product.id === id);
    }

    async addProduct(newProductData) {
        const products = await this._readProductsFile();
        const newProduct = { id: Date.now().toString(), ...newProductData, status: true };
        products.push(newProduct);
        await this._writeProductsFile(products);
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this._readProductsFile();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updates };
        await this._writeProductsFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this._readProductsFile();
        const filteredProducts = products.filter(product => product.id !== id);
        await this._writeProductsFile(filteredProducts);
        return filteredProducts;
    }

    async _readProductsFile() {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    async _writeProductsFile(data) {
        await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
    }
}

module.exports = new ProductManager();