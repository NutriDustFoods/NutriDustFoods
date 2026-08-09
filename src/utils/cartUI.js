import {
    getCart,
    getCartCount,
    increaseQuantity,
    decreaseQuantity
} from "../services/cartService.js";

export function renderCart() {

    const cart = getCart();

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems || !cartTotal || !cartCount) return;

    cartCount.textContent = getCartCount();

    if (cart.length === 0) {

        cartItems.innerHTML = `
        <div class="text-center py-5">

            <i class="bi bi-cart-x display-1 text-secondary"></i>

            <p class="text-secondary mt-3">
                Your cart is empty.
            </p>

        </div>
        `;

        cartTotal.textContent = "₦0";

        return;

    }

    let total = 0;

    cartItems.innerHTML = "";

    cart.forEach(item => {

        const productId = item._id || item.id;

        const subtotal = item.price * item.quantity;

        total += subtotal;

        cartItems.innerHTML += `

<div class="card bg-secondary text-white mb-3">

    <div class="card-body">

        <div class="d-flex justify-content-between align-items-start">

            <div>

                <h5 class="text-warning">
                    ${item.name}
                </h5>

                <p class="mb-1">
                    ₦${Number(item.price).toLocaleString()}
                </p>

            </div>

            <h5>
                ₦${subtotal.toLocaleString()}
            </h5>

        </div>

        <div class="d-flex align-items-center gap-2 mt-3">

            <button
                class="btn btn-danger decrease-btn"
                data-id="${productId}">

                <i class="bi bi-dash"></i>

            </button>

            <span class="fw-bold">
                ${item.quantity}
            </span>

            <button
                class="btn btn-success increase-btn"
                data-id="${productId}">

                <i class="bi bi-plus"></i>

            </button>

        </div>

    </div>

</div>

`;

    });

    cartTotal.textContent =
        "₦" + total.toLocaleString();

    document.querySelectorAll(".increase-btn").forEach(button => {

        button.onclick = () => {

            increaseQuantity(button.dataset.id);

            renderCart();

        };

    });

    document.querySelectorAll(".decrease-btn").forEach(button => {

        button.onclick = () => {

            decreaseQuantity(button.dataset.id);

            renderCart();

        };

    });

}