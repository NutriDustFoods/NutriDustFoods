import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";

import { Navbar } from "./components/Navbar.js";
import { Hero } from "./components/Hero.js";
import { WhyChoose } from "./components/WhyChoose.js";
import { Products } from "./components/Products.js";
import { Stats } from "./components/Stats.js";
import { ProductModal } from "./components/ProductModal.js";
import { SearchBar } from "./components/SearchBar.js";
import { CategoryFilter } from "./components/CategoryFilter.js";
import { Cart } from "./components/Cart.js";
import { Checkout } from "./components/Checkout.js";

import { showProduct } from "./utils/modal.js";
import { renderCart } from "./utils/cartUI.js";

import { getProducts, createOrder } from "./services/api.js";

import {
    addToCart,
    getCart,
    clearCart
} from "./services/cartService.js";


async function init() {

    const products = await getProducts();

    document.querySelector("#app").innerHTML = `
        ${Navbar()}
        ${Hero()}
        ${WhyChoose()}
        ${SearchBar()}
        ${CategoryFilter()}
        ${await Products()}
        ${Stats()}
        ${ProductModal()}
        ${Cart()}
        ${Checkout()}
    `;


    renderCart();


    // =====================================================
    // CART
    // =====================================================

    const cart = bootstrap.Offcanvas.getOrCreateInstance(
        document.getElementById("cart")
    );


    document
        .getElementById("cartButton")
        .addEventListener("click", () => {

            const modalElement =
                document.getElementById("productModal");


            if (modalElement.classList.contains("show")) {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(
                        modalElement
                    );


                modalElement.addEventListener(
                    "hidden.bs.modal",
                    () => {

                        cart.show();

                    },
                    { once: true }
                );


                modal.hide();

            } else {

                cart.show();

            }

        });


    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    document
        .querySelectorAll(".view-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product = products.find(
                    p => p.id === Number(button.dataset.id)
                );


                if (!product) {

                    console.error(
                        "❌ Product not found:",
                        button.dataset.id
                    );

                    return;

                }


                showProduct(product);

            });

        });


    // =====================================================
    // ADD TO CART
    // =====================================================

    document
        .querySelectorAll(".add-to-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product = products.find(
                    p => p.id === Number(button.dataset.id)
                );


                if (!product) {

                    console.error(
                        "❌ Product not found:",
                        button.dataset.id
                    );

                    return;

                }


                addToCart(product);

                renderCart();

            });

        });


    // =====================================================
    // PROCEED TO CHECKOUT
    // =====================================================

    document
        .getElementById("checkoutButton")
        .addEventListener("click", () => {

            const cartItems = getCart();


            if (cartItems.length === 0) {

                alert("Your cart is empty.");

                return;

            }


            cart.hide();


            document.getElementById("checkoutTotal").textContent =
                document.getElementById("cartTotal").textContent;


            bootstrap.Modal
                .getOrCreateInstance(
                    document.getElementById("checkoutModal")
                )
                .show();

        });


    // =====================================================
    // CHECKOUT FORM
    // =====================================================

    document
        .getElementById("checkoutForm")
        .addEventListener("submit", async (event) => {

            event.preventDefault();


            // Get the submit button directly from the form
            const submitButton =
                event.currentTarget.querySelector(
                    'button[type="submit"]'
                );


            const customerName =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const customerPhone =
                document
                    .getElementById("customerPhone")
                    .value
                    .trim();


            const customerEmail =
                document
                    .getElementById("customerEmail")
                    .value
                    .trim();


            const deliveryAddress =
                document
                    .getElementById("customerAddress")
                    .value
                    .trim();


            const cartItems = getCart();


            if (cartItems.length === 0) {

                alert("Your cart is empty.");

                return;

            }


            // =================================================
            // CREATE ORDER ITEMS
            // =================================================

            const items = cartItems.map(item => ({

                productId: item.id || item._id,

                name: item.name,

                price: Number(item.price),

                quantity: Number(item.quantity)

            }));


            // =================================================
            // CALCULATE ORDER TOTAL
            // =================================================

            const total = cartItems.reduce(
                (sum, item) => {

                    return sum +
                        Number(item.price) *
                        Number(item.quantity);

                },
                0
            );


            const orderData = {

                customerName,

                customerPhone,

                customerEmail,

                deliveryAddress,

                items,

                total

            };


            try {

                // Disable button while submitting
                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Order...";


                console.log(
                    "📦 Sending order:",
                    orderData
                );


                const data =
                    await createOrder(orderData);


                console.log(
                    "✅ Order created:",
                    data
                );


                if (
                    !data ||
                    !data.success ||
                    !data.order
                ) {

                    throw new Error(
                        data?.message ||
                        "The order could not be created."
                    );

                }


                // =================================================
                // DATABASE USES total_amount
                // =================================================

                const orderTotal =
                    Number(data.order.total_amount);


                alert(
                    "Order created successfully!\n\n" +
                    "Order ID: #" +
                    data.order.id +
                    "\n" +
                    "Total: ₦" +
                    orderTotal.toLocaleString()
                );


                // =================================================
                // CLEAR CART
                // =================================================

                clearCart();

                renderCart();


                // =================================================
                // CLOSE CHECKOUT
                // =================================================

                bootstrap.Modal
                    .getOrCreateInstance(
                        document.getElementById(
                            "checkoutModal"
                        )
                    )
                    .hide();


                // =================================================
                // RESTORE BUTTON
                // =================================================

                submitButton.disabled = false;

                submitButton.textContent =
                    "Continue to Payment";


            } catch (error) {

                console.error(
                    "❌ Order creation failed:",
                    error
                );


                alert(
                    "Unable to create your order.\n\n" +
                    error.message
                );


                // Restore button
                submitButton.disabled = false;

                submitButton.textContent =
                    "Continue to Payment";

            }

        });

}


init();