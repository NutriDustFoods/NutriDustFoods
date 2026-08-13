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
import { PaymentSuccess } from "./components/PaymentSuccess.js";

import { showProduct } from "./utils/modal.js";
import { renderCart } from "./utils/cartUI.js";

import {
    getProducts,
    createOrder,
    initializePayment,
    verifyPayment
} from "./services/api.js";

import {
    addToCart,
    getCart,
    clearCart
} from "./services/cartService.js";


// =====================================================
// HANDLE PAYSTACK PAYMENT CALLBACK
// =====================================================

async function handlePaymentCallback() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const reference =
        params.get("reference") ||
        params.get("trxref");


    // No Paystack reference
    if (!reference) {

        return false;

    }


    console.log(
        "🔍 Payment callback detected:",
        reference
    );


    try {

        // =================================================
        // VERIFY PAYMENT
        // =================================================

        const result =
            await verifyPayment(reference);


        console.log(
            "✅ Payment verification result:",
            result
        );


        if (
            !result ||
            !result.success ||
            !result.order
        ) {

            throw new Error(
                result?.message ||
                "Payment verification failed."
            );

        }


        // =================================================
        // CLEAR CART
        // =================================================

        clearCart();

        renderCart();


        // =================================================
        // REMOVE PAYSTACK PARAMETERS FROM URL
        // =================================================

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );


        // =================================================
        // REMOVE PENDING ORDER
        // =================================================

        localStorage.removeItem(
            "nutridust-pending-order"
        );


        // =================================================
        // SHOW PAYMENT SUCCESS MODAL
        // =================================================

        const successModalElement =
            document.getElementById(
                "paymentSuccessModal"
            );


        if (!successModalElement) {

            console.error(
                "❌ Payment success modal was not found."
            );

            return true;

        }


        const orderIdElement =
            document.getElementById(
                "successOrderId"
            );


        const amountElement =
            document.getElementById(
                "successOrderAmount"
            );


        // Display order number
        if (orderIdElement) {

            orderIdElement.textContent =
                `#${result.order.id}`;

        }


        // Display total paid
        if (amountElement) {

            amountElement.textContent =
                `₦${Number(
                    result.order.total_amount
                ).toLocaleString()}`;

        }


        // Open Bootstrap modal
        const successModal =
            bootstrap.Modal
                .getOrCreateInstance(
                    successModalElement
                );


        successModal.show();


        return true;


    } catch (error) {

        console.error(
            "❌ Payment verification failed:",
            error
        );


        // Remove Paystack parameters
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );


        alert(
            "We could not verify your payment.\n\n" +
            error.message
        );


        return false;

    }

}


// =====================================================
// INITIALIZE APPLICATION
// =====================================================

async function init() {

    try {

        // =================================================
        // GET PRODUCTS
        // =================================================

        const products =
            await getProducts();


        // =================================================
        // RENDER APPLICATION
        // =================================================

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

            ${PaymentSuccess()}

        `;


        // =================================================
        // RENDER CART
        // =================================================

        renderCart();


        // =================================================
        // HANDLE PAYSTACK CALLBACK
        // =================================================

        await handlePaymentCallback();


        // =====================================================
        // CART
        // =====================================================

        const cart =
            bootstrap.Offcanvas.getOrCreateInstance(
                document.getElementById("cart")
            );


        document
            .getElementById("cartButton")
            .addEventListener(
                "click",
                () => {

                    const modalElement =
                        document.getElementById(
                            "productModal"
                        );


                    if (
                        modalElement &&
                        modalElement.classList.contains(
                            "show"
                        )
                    ) {

                        const modal =
                            bootstrap.Modal
                                .getOrCreateInstance(
                                    modalElement
                                );


                        modalElement.addEventListener(
                            "hidden.bs.modal",
                            () => {

                                cart.show();

                            },
                            {
                                once: true
                            }
                        );


                        modal.hide();

                    } else {

                        cart.show();

                    }

                }
            );


        // =====================================================
        // VIEW PRODUCT
        // =====================================================

        document
            .querySelectorAll(".view-product")
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const product =
                                products.find(
                                    p =>
                                        p.id ===
                                        Number(
                                            button.dataset.id
                                        )
                                );


                            if (!product) {

                                console.error(
                                    "❌ Product not found:",
                                    button.dataset.id
                                );

                                return;

                            }


                            showProduct(product);

                        }
                    );

                }
            );


        // =====================================================
        // ADD TO CART
        // =====================================================

        document
            .querySelectorAll(".add-to-cart")
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const product =
                                products.find(
                                    p =>
                                        p.id ===
                                        Number(
                                            button.dataset.id
                                        )
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

                        }
                    );

                }
            );


        // =====================================================
        // PROCEED TO CHECKOUT
        // =====================================================

        document
            .getElementById(
                "checkoutButton"
            )
            .addEventListener(
                "click",
                () => {

                    const cartItems =
                        getCart();


                    if (
                        cartItems.length === 0
                    ) {

                        alert(
                            "Your cart is empty."
                        );

                        return;

                    }


                    cart.hide();


                    document
                        .getElementById(
                            "checkoutTotal"
                        )
                        .textContent =
                        document
                            .getElementById(
                                "cartTotal"
                            )
                            .textContent;


                    bootstrap.Modal
                        .getOrCreateInstance(
                            document.getElementById(
                                "checkoutModal"
                            )
                        )
                        .show();

                }
            );


        // =====================================================
        // CHECKOUT FORM
        // =====================================================

        document
            .getElementById(
                "checkoutForm"
            )
            .addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const submitButton =
                        event.currentTarget
                            .querySelector(
                                'button[type="submit"]'
                            );


                    // =================================================
                    // CUSTOMER INFORMATION
                    // =================================================

                    const customerName =
                        document
                            .getElementById(
                                "customerName"
                            )
                            .value
                            .trim();


                    const customerPhone =
                        document
                            .getElementById(
                                "customerPhone"
                            )
                            .value
                            .trim();


                    const customerEmail =
                        document
                            .getElementById(
                                "customerEmail"
                            )
                            .value
                            .trim();


                    const deliveryAddress =
                        document
                            .getElementById(
                                "customerAddress"
                            )
                            .value
                            .trim();


                    const cartItems =
                        getCart();


                    if (
                        cartItems.length === 0
                    ) {

                        alert(
                            "Your cart is empty."
                        );

                        return;

                    }


                    // =================================================
                    // CREATE ORDER ITEMS
                    // =================================================

                    const items =
                        cartItems.map(
                            item => ({

                                productId:
                                    item.id ||
                                    item._id,

                                name:
                                    item.name,

                                price:
                                    Number(
                                        item.price
                                    ),

                                quantity:
                                    Number(
                                        item.quantity
                                    )

                            })
                        );


                    // =================================================
                    // CALCULATE TOTAL
                    // =================================================

                    const total =
                        cartItems.reduce(
                            (
                                sum,
                                item
                            ) => {

                                return (
                                    sum +
                                    Number(
                                        item.price
                                    ) *
                                    Number(
                                        item.quantity
                                    )
                                );

                            },
                            0
                        );


                    // =================================================
                    // ORDER DATA
                    // =================================================

                    const orderData = {

                        customerName,

                        customerPhone,

                        customerEmail,

                        deliveryAddress,

                        items,

                        total

                    };


                    try {

                        // =================================================
                        // DISABLE BUTTON
                        // =================================================

                        submitButton.disabled =
                            true;


                        submitButton.textContent =
                            "Creating Order...";


                        console.log(
                            "📦 Sending order:",
                            orderData
                        );


                        // =================================================
                        // CREATE ORDER
                        // =================================================

                        const orderResponse =
                            await createOrder(
                                orderData
                            );


                        console.log(
                            "✅ Order created:",
                            orderResponse
                        );


                        if (
                            !orderResponse ||
                            !orderResponse.success ||
                            !orderResponse.order
                        ) {

                            throw new Error(
                                orderResponse?.message ||
                                "The order could not be created."
                            );

                        }


                        const orderId =
                            orderResponse.order.id;


                        // =================================================
                        // INITIALIZE PAYSTACK
                        // =================================================

                        submitButton.textContent =
                            "Connecting to Payment...";


                        console.log(
                            "💳 Initializing payment for Order:",
                            orderId
                        );


                        const paymentResponse =
                            await initializePayment(
                                orderId
                            );


                        console.log(
                            "💳 Payment response:",
                            paymentResponse
                        );


                        if (
                            !paymentResponse ||
                            !paymentResponse.success ||
                            !paymentResponse.authorizationUrl
                        ) {

                            throw new Error(
                                paymentResponse?.message ||
                                "Unable to initialize payment."
                            );

                        }


                        // =================================================
                        // SAVE PENDING ORDER
                        // =================================================

                        localStorage.setItem(
                            "nutridust-pending-order",
                            String(orderId)
                        );


                        // =================================================
                        // REDIRECT TO PAYSTACK
                        // =================================================

                        window.location.href =
                            paymentResponse
                                .authorizationUrl;


                    } catch (error) {

                        console.error(
                            "❌ Checkout / Payment Error:",
                            error
                        );


                        alert(
                            "Unable to continue to payment.\n\n" +
                            error.message
                        );


                        submitButton.disabled =
                            false;


                        submitButton.textContent =
                            "Continue to Payment";

                    }

                }
            );


        // =====================================================
        // VIEW ORDER BUTTON
        // =====================================================

        document
            .getElementById(
                "viewOrderButton"
            )
            ?.addEventListener(
                "click",
                () => {

                    const orderId =
                        document
                            .getElementById(
                                "successOrderId"
                            )
                            ?.textContent
                            .replace(
                                "#",
                                ""
                            );


                    if (!orderId) {

                        return;

                    }


                    console.log(
                        "📦 View Order:",
                        orderId
                    );


                    alert(
                        "Order #" +
                        orderId +
                        " has been received and is now being processed."
                    );

                }
            );


    } catch (error) {

        console.error(
            "❌ Application initialization failed:",
            error
        );


        const app =
            document.querySelector("#app");


        if (app) {

            app.innerHTML = `

                <div class="container py-5">

                    <div class="alert alert-danger">

                        <h4>
                            Unable to load NutriDust Foods
                        </h4>

                        <p class="mb-0">
                            ${error.message}
                        </p>

                    </div>

                </div>

            `;

        }

    }

}


// =====================================================
// START APPLICATION
// =====================================================

init();