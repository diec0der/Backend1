const fs = require('fs').promises;
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');

class ProductManager {
    async getAllProducts(limit) {
        try {
            const products = await this._readProductsFile();
            return limit ? products.slice(0, Number(limit)) : products;
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this._readProductsFile();
            return products.find(product => product.id === id);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
    }

    async addProduct(newProductData) {
        try {
            const products = await this._readProductsFile();
            const newProduct = { id: Date.now().toString(), ...newProductData, status: true };
            products.push(newProduct);
            await this._writeProductsFile(products);
            return newProduct;
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updates) {
        try {
            const products = await this._readProductsFile();
            const index = products.findIndex(product => product.id === id);
            if (index === -1) return null;
            products[index] = { ...products[index], ...updates };
            await this._writeProductsFile(products);
            return products[index];
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this._readProductsFile();
            const filteredProducts = products.filter(product => product.id !== id);
            await this._writeProductsFile(filteredProducts);
            return filteredProducts;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return [];
        }
    }

    async _readProductsFile() {
        try {
            const data = await fs.readFile(productsFilePath, 'utf-8');
            return JSON.parse(data || '[]');
        } catch (error) {
            console.error('Error al leer el archivo de productos:', error);
            return [];
        }
    }

    async _writeProductsFile(data) {
        try {
            await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error al escribir en el archivo de productos:', error);
        }
    }
}

module.exports = ProductManager;
