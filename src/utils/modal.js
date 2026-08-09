import * as bootstrap from "bootstrap";
import { addToCart } from "../services/cartService.js";
import { renderCart } from "./cartUI.js";

let currentProduct = null;
let quantity = 1;

export function showProduct(product) {

    if (!product) return;

    currentProduct = product;
    quantity = 1;

    document.getElementById("modalImage").src =
        `/products/${product.image}`;

    document.getElementById("modalCategory").textContent =
        product.category;

    document.getElementById("modalTitle").textContent =
        product.name;

    document.getElementById("modalPrice").textContent =
        `₦${Number(product.price).toLocaleString()}`;

    document.getElementById("modalDescription").textContent =
        product.description;

    document.getElementById("modalQty").textContent =
        quantity;

    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("productModal")
    );

    const addBtn = document.getElementById("modalAddToCart");

    addBtn.onclick = () => {

        if (!currentProduct) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(currentProduct);
        }

        renderCart();

        modal.hide();

        document
            .getElementById("productModal")
            .addEventListener(
                "hidden.bs.modal",
                () => {

                    const cart = bootstrap.Offcanvas.getOrCreateInstance(
                        document.getElementById("cart")
                    );

                    cart.show();

                },
                { once: true }
            );
    };

    modal.show();
}

// Increase Quantity
document.addEventListener("click", (e) => {

    if (e.target.closest("#qtyPlus")) {

        quantity++;

        document.getElementById("modalQty").textContent = quantity;

    }

});

// Decrease Quantity
document.addEventListener("click", (e) => {

    if (e.target.closest("#qtyMinus")) {

        if (quantity > 1) {

            quantity--;

            document.getElementById("modalQty").textContent = quantity;

        }

    }

});