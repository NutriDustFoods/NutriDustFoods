let cart = JSON.parse(localStorage.getItem("nutridust-cart")) || [];

function saveCart() {
    localStorage.setItem("nutridust-cart", JSON.stringify(cart));
}

export function getCart() {
    return cart;
}

export function addToCart(product) {

    const productId = product._id || product.id;

    const existing = cart.find(
        item => (item._id || item.id) == productId
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            _id: productId,
            quantity: 1
        });

    }

    saveCart();

    return cart;
}

export function getCartCount() {

    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

}

export function increaseQuantity(id) {

    const item = cart.find(
        product => (product._id || product.id) == id
    );

    if (item) {

        item.quantity++;

        saveCart();

    }

}

export function decreaseQuantity(id) {

    const item = cart.find(
        product => (product._id || product.id) == id
    );

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {

        cart = cart.filter(
            product => (product._id || product.id) != id
        );

    }

    saveCart();

}

export function clearCart() {

    cart = [];

    saveCart();

}