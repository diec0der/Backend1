const socket = io();

socket.on('productAdded', (newProduct) => {
    const productList = document.getElementById('product-list');

    const productItem = document.createElement('li');
    productItem.textContent = `${newProduct.title} - Precio: ${newProduct.price}`;

    productList.appendChild(productItem);
});

const productForm = document.getElementById('product-form');
productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('product-title').value;
    const price = document.getElementById('product-price').value;

    socket.emit('addProduct', { title, price });

    productForm.reset();
});