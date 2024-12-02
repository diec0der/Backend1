const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');

router.post('/', cartsController.createCart);

router.get('/:cid', cartsController.getCartById);

router.post('/:cid/products/:pid', cartsController.addProductToCart);

router.delete('/:cid/product/:pid', cartsController.removeProductFromCart);

router.delete('/:cid', cartsController.clearCart);

module.exports = router;