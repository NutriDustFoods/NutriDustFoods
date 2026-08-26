import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";


// =====================================================
// COMPONENTS
// =====================================================

import {
    Navbar,
    initNavbarAccount
} from "./components/Navbar.js";

import { Hero } from "./components/Hero.js";
import { WhyChoose } from "./components/WhyChoose.js";
import { Products, refreshCustomerProductsSilently } from "./components/Products.js";
import { Stats } from "./components/stats.js";
import { ProductModal } from "./components/ProductModal.js";
import { SearchBar } from "./components/SearchBar.js";
import { CategoryFilter } from "./components/CategoryFilter.js";
import { Cart } from "./components/Cart.js";
import { Checkout } from "./components/Checkout.js";
import { PaymentSuccess } from "./components/PaymentSuccess.js";
import { TrackOrder } from "./components/TrackOrder.js";
import { CustomerAccount, setupCustomerAccount } from "./components/CustomerAccount.js";
import { CustomerOrder, setupCustomerOrders } from "./components/CustomerOrder.js";


// =====================================================
// CUSTOMER AUTH
// =====================================================

import {
    Auth,
    initAuth
} from "./components/Auth.js";


// =====================================================
// UTILITIES
// =====================================================

import {
    showProduct
} from "./utils/modal.js";

import {
    renderCart
} from "./utils/cartUI.js";


// =====================================================
// API
// =====================================================

import {
    getProducts,
    createOrder,
    initializePayment,
    verifyPayment,
    getOrderById,
    getCustomerToken,
    getSavedCustomer,
    getCurrentCustomer
    ,getDeliveryQuote
} from "./services/api.js";


// =====================================================
// CART SERVICE
// =====================================================

import {
    addToCart,
    getCart,
    clearCart
} from "./services/cartService.js";


// =====================================================
// CUSTOMER AUTHENTICATION HELPERS
// =====================================================

function getLoggedInCustomer() {

    try {

        const customer =
            getSavedCustomer();

        return customer || null;

    } catch (error) {

        console.error(
            "❌ Unable to read customer session:",
            error
        );

        return null;

    }

}


// =====================================================
// CHECK CUSTOMER LOGIN
// =====================================================

function isCustomerLoggedIn() {

    const token =
        getCustomerToken();

    const customer =
        getLoggedInCustomer();

    return Boolean(
        token &&
        customer
    );

}


// =====================================================
// OPEN CUSTOMER AUTH MODAL
// =====================================================

function openCustomerAuth() {

    const authModalElement =
        document.getElementById(
            "customerAuthModal"
        );


    if (!authModalElement) {

        console.error(
            "❌ Customer authentication modal was not found."
        );


        alert(
            "Please login or create an account before checkout."
        );

        return;

    }


    const authModal =
        bootstrap.Modal
            .getOrCreateInstance(
                authModalElement
            );


    authModal.show();

}


// =====================================================
// PAYMENT AMOUNT HELPER
// =====================================================

function getOrderAmount(order) {

    if (!order) {

        return 0;

    }


    const possibleAmounts = [

        order.total,

        order.totalAmount,

        order.total_amount,

        order.amount,

        order.paidAmount,

        order.paid_amount,

        order.grandTotal,

        order.grand_total

    ];


    for (
        const value
        of possibleAmounts
    ) {

        if (

            value !== undefined &&

            value !== null &&

            value !== "" &&

            Number.isFinite(
                Number(value)
            )

        ) {

            return Number(value);

        }

    }


    return 0;

}


// =====================================================
// FORMAT CURRENCY
// =====================================================

function formatNaira(amount) {

    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(
            numericAmount
        )
    ) {

        return "₦0";

    }


    return (
        "₦" +
        numericAmount.toLocaleString(
            "en-NG"
        )
    );

}


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
            await verifyPayment(
                reference
            );


        console.log(
            "✅ Payment verification result:",
            result
        );


        // =================================================
        // VALIDATE RESPONSE
        // =================================================

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


        console.log(
            "📦 Verified order:",
            result.order
        );


        // =================================================
        // GET VERIFIED ORDER AMOUNT
        // =================================================

        const totalPaid =
            getOrderAmount(
                result.order
            );


        console.log(
            "💰 Total paid:",
            totalPaid
        );


        // =================================================
        // CLEAR CART
        // =================================================

        clearCart();

        renderCart();


        // =================================================
        // REMOVE PAYSTACK PARAMETERS
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


        // =================================================
        // ORDER NUMBER
        // =================================================

        const orderIdElement =
            document.getElementById(
                "successOrderId"
            );


        if (orderIdElement) {

            orderIdElement.textContent =
                `#${result.order.id}`;

        }


        // =================================================
        // TOTAL PAID
        // =================================================

        const amountElement =
            document.getElementById(
                "successOrderAmount"
            );


        if (amountElement) {

            amountElement.textContent =
                formatNaira(
                    totalPaid
                );

        }


        // =================================================
        // OPEN SUCCESS MODAL
        // =================================================

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


        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );


        alert(
            "We could not verify your payment.\n\n" +
            (
                error?.message ||
                "Unknown payment verification error."
            )
        );


        return false;

    }

}


// =====================================================
// STATUS TRACKER HELPER
// =====================================================

function buildStatusTracker(order) {

    let status =
        String(
            order?.orderStatus ||
            "pending"
        ).toLowerCase();

    if (status === "shipped" || status === "on_delivery") {
        status = "out_for_delivery";
    }

    const isPickup = order?.fulfillmentType === "pickup";


    const statuses = isPickup
        ? ["pending", "processing", "ready_for_pickup", "delivered"]
        : ["pending", "processing", "out_for_delivery", "delivered"];

    const statusLabels = isPickup
        ? {
            pending: "Pending",
            processing: "Processing",
            ready_for_pickup: "Ready for Pickup",
            delivered: "Collected"
        }
        : {
            pending: "Pending",
            processing: "Processing",
            out_for_delivery: "On Delivery",
            delivered: "Delivered"
        };


    const currentIndex =
        statuses.indexOf(
            status
        );


    if (
        status === "cancelled"
    ) {

        return `

            <div class="alert alert-danger mb-4">

                <div class="d-flex align-items-center">

                    <i
                        class="bi bi-x-circle-fill me-2"
                        style="font-size: 1.4rem;"
                    ></i>

                    <div>

                        <strong>
                            Order Cancelled
                        </strong>

                        <div class="small">
                            This order has been cancelled.
                        </div>

                    </div>

                </div>

            </div>

        `;

    }


    const safeCurrentIndex =
        currentIndex >= 0
            ? currentIndex
            : 0;


    return `

        <div class="mb-4">

            <h6 class="fw-bold mb-3">
                Order Progress
            </h6>


            <div
                class="
                    d-flex
                    justify-content-between
                    text-center
                "
            >

                ${statuses.map(
                    (item, index) => {

                        const completed =
                            index <=
                            safeCurrentIndex;


                        const active =
                            index ===
                            safeCurrentIndex;


                        return `

                            <div
                                style="flex: 1;"
                            >

                                <div
                                    class="
                                        mx-auto
                                        rounded-circle
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                        ${
                                            completed
                                                ? "bg-success text-white"
                                                : "bg-light text-secondary"
                                        }
                                    "
                                    style="
                                        width: 36px;
                                        height: 36px;
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            ${
                                                completed
                                                    ? "bi-check-lg"
                                                    : "bi-circle"
                                            }
                                        "
                                    ></i>

                                </div>


                                <small
                                    class="
                                        d-block
                                        mt-2
                                        ${
                                            active
                                                ? "fw-bold text-success"
                                                : "text-muted"
                                        }
                                    "
                                >

                                    ${statusLabels[item] || item}

                                </small>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;

}


// =====================================================
// BUILD ORDER ITEMS HTML
// =====================================================

function buildOrderItemsHTML(order) {

    const items =
        Array.isArray(
            order?.items
        )
            ? order.items
            : [];


    if (
        items.length === 0
    ) {

        return `

            <p class="text-muted mb-0">

                No order items available.

            </p>

        `;

    }


    return items.map(
        item => `

            <div
                class="
                    d-flex
                    justify-content-between
                    align-items-center
                    border-bottom
                    py-2
                "
            >

                <div>

                    <div class="fw-semibold">

                        ${item.name || "Product"}

                    </div>

                    <small class="text-muted">

                        Qty: ${Number(
                            item.quantity || 0
                        )}

                    </small>

                </div>


                <strong>

                    ${formatNaira(
                        item.total || 0
                    )}

                </strong>

            </div>

        `
    ).join("");

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

        document.querySelector(
            "#app"
        ).innerHTML = `

            ${Navbar()}

            ${Hero()}

            ${WhyChoose()}

            ${SearchBar()}

            ${CategoryFilter()}

            ${await Products()}

            ${Stats()}

            ${TrackOrder()}

            ${ProductModal()}

            ${Cart()}

            ${Checkout()}

            ${PaymentSuccess()}

            ${Auth()}

            ${CustomerAccount()}

            ${CustomerOrder()}

        `;


        // =================================================
        // INITIALIZE AUTHENTICATION
        // =================================================

        initAuth();


        // =================================================
        // INITIALIZE CUSTOMER NAVBAR
        // =================================================

        initNavbarAccount();
        setupCustomerAccount();
        setupCustomerOrders();
        window.addEventListener("nutridust:track-order", event => {
            const modal = document.getElementById("customerOrdersModal");
            if (modal) bootstrap.Modal.getInstance(modal)?.hide();
            const section = document.getElementById("trackOrderSection");
            section?.scrollIntoView({ behavior:"smooth", block:"start" });
            const input = document.getElementById("trackOrderNumber");
            if (input) input.value = event.detail?.orderId || input.value;
            setTimeout(() => document.getElementById("trackOrderForm")?.requestSubmit(), 350);
        });


        // =================================================
        // REFRESH CUSTOMER FROM BACKEND
        // =================================================
        //
        // This makes the backend the source of truth
        // for the logged-in customer's account.
        //
        // =================================================

        if (
            getCustomerToken()
        ) {

            try {

                const customerResponse =
                    await getCurrentCustomer();


                if (
                    customerResponse?.success
                ) {

                    console.log(
                        "✅ Current customer loaded:",
                        customerResponse.customer
                    );

                }

            } catch (error) {

                console.warn(
                    "⚠️ Unable to refresh customer session:",
                    error?.message
                );

            }

        }


        console.log(
            "🔐 Customer session:",
            getLoggedInCustomer()
        );


        // =================================================
        // RENDER CART
        // =================================================

        renderCart();


        // =================================================
        // HANDLE PAYSTACK CALLBACK
        // =================================================

        await handlePaymentCallback();


        // =================================================
        // CART
        // =================================================

        const cartElement =
            document.getElementById(
                "cart"
            );


        const cart =
            bootstrap.Offcanvas
                .getOrCreateInstance(
                    cartElement
                );


        const cartButton =
            document.getElementById(
                "cartButton"
            );


        if (cartButton) {

            cartButton.addEventListener(
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

        }


        // =================================================
        // VIEW PRODUCT
        // =================================================

        document
            .querySelectorAll(
                ".view-product"
            )
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


                            showProduct(
                                product
                            );

                        }
                    );

                }
            );


        // =================================================
        // ADD TO CART
        // =================================================

        document
            .querySelectorAll(
                ".add-to-cart"
            )
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


                            addToCart(
                                product
                            );


                            renderCart();

                        }
                    );

                }
            );


        // =================================================
        // PROCEED TO CHECKOUT
        // =================================================

        const checkoutButton =
            document.getElementById(
                "checkoutButton"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                () => {

                    const cartItems =
                        getCart();


                    // =================================================
                    // CART EMPTY
                    // =================================================

                    if (
                        cartItems.length === 0
                    ) {

                        alert(
                            "Your cart is empty."
                        );

                        return;

                    }


                    // =================================================
                    // CUSTOMER LOGIN REQUIRED
                    // =================================================

                    if (
                        !isCustomerLoggedIn()
                    ) {

                        console.log(
                            "🔐 Checkout blocked: customer is not logged in."
                        );


                        cart.hide();


                        openCustomerAuth();


                        return;

                    }


                    // =================================================
                    // CUSTOMER IS LOGGED IN
                    // =================================================

                    const customer =
                        getLoggedInCustomer();


                    console.log(
                        "✅ Customer allowed to checkout:",
                        customer
                    );


                    cart.hide();


                    const checkoutTotal =
                        document.getElementById(
                            "checkoutTotal"
                        );


                    const cartTotal =
                        document.getElementById(
                            "cartTotal"
                        );


                    if (
                        checkoutTotal &&
                        cartTotal
                    ) {

                        checkoutTotal.textContent =
                            cartTotal.textContent;

                    }


                    bootstrap.Modal
                        .getOrCreateInstance(
                            document.getElementById(
                                "checkoutModal"
                            )
                        )
                        .show();

                }
            );

        }


        // =================================================
        // CHECKOUT FORM
        // =================================================

        const checkoutForm =
            document.getElementById(
                "checkoutForm"
            );


        if (checkoutForm) {

            let currentDeliveryQuote = null;
            const updateFulfillmentSummary = async (calculateRoute = false) => {
                const fulfillmentType = checkoutForm.querySelector('input[name="fulfillmentType"]:checked')?.value || "delivery";
                const addressGroup = document.getElementById("deliveryAddressGroup");
                const addressInput = document.getElementById("customerAddress");
                const feeBox = document.getElementById("checkoutDeliveryFee");
                const cartTotalText = document.getElementById("cartTotal")?.textContent || "0";
                const subtotal = Number(cartTotalText.replace(/[^0-9.]/g, "")) || 0;
                let deliveryFee = 0;
                if (fulfillmentType === "delivery" && calculateRoute && addressInput?.value.trim().length >= 5) {
                    if (feeBox) feeBox.textContent = "Calculating route…";
                    try { currentDeliveryQuote = await getDeliveryQuote(addressInput.value.trim()); }
                    catch (error) { currentDeliveryQuote = null; if (feeBox) feeBox.textContent = error.response?.data?.message || "Unable to calculate"; return; }
                }
                if (fulfillmentType === "delivery") deliveryFee = Number(currentDeliveryQuote?.fee || 0);
                if (addressGroup) addressGroup.classList.toggle("d-none", fulfillmentType === "pickup");
                if (addressInput) addressInput.required = fulfillmentType === "delivery";
                const subtotalBox = document.getElementById("checkoutSubtotal");
                const totalBox = document.getElementById("checkoutTotal");
                if (subtotalBox) subtotalBox.textContent = `₦${subtotal.toLocaleString()}`;
                if (feeBox) feeBox.textContent = fulfillmentType === "pickup" ? "Free" : deliveryFee ? `₦${deliveryFee.toLocaleString()} (${currentDeliveryQuote.estimated ? "local test rate" : `${currentDeliveryQuote.distanceKm} km`})` : "Enter your address";
                if (totalBox) totalBox.textContent = `₦${(subtotal + deliveryFee).toLocaleString()}`;
            };

            checkoutForm.querySelectorAll('input[name="fulfillmentType"]').forEach(input => input.addEventListener("change",()=>{currentDeliveryQuote=null;updateFulfillmentSummary(false);}));
            document.getElementById("customerAddress")?.addEventListener("blur",()=>updateFulfillmentSummary(true));
            document.getElementById("checkoutModal")?.addEventListener("shown.bs.modal", updateFulfillmentSummary);

            checkoutForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    // =================================================
                    // REQUIRE CUSTOMER LOGIN
                    // =================================================

                    if (
                        !isCustomerLoggedIn()
                    ) {

                        alert(
                            "Please login before placing your order."
                        );


                        openCustomerAuth();


                        return;

                    }


                    const customer =
                        getLoggedInCustomer();


                    if (!customer) {

                        alert(
                            "Your customer session could not be found. Please login again."
                        );

                        return;

                    }


                    const submitButton =
                        event.currentTarget
                            .querySelector(
                                'button[type="submit"]'
                            );


                    // =================================================
                    // DELIVERY ADDRESS
                    // =================================================

                    const addressInput =
                        document.getElementById(
                            "customerAddress"
                        );


                    const deliveryAddress =
                        addressInput
                            ?.value
                            ?.trim() || "";

                    const fulfillmentType = event.currentTarget.querySelector('input[name="fulfillmentType"]:checked')?.value || "delivery";


                    // =================================================
                    // VALIDATE DELIVERY ADDRESS
                    // =================================================

                    if (
                        fulfillmentType === "delivery" && !deliveryAddress
                    ) {

                        alert(
                            "Please enter your delivery address."
                        );

                        return;

                    }


                    // =================================================
                    // GET CART
                    // =================================================

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
                    // CREATE CLEAN ORDER ITEMS
                    // =================================================
                    //
                    // IMPORTANT:
                    //
                    // We only send product IDs and quantities.
                    //
                    // We deliberately DO NOT trust:
                    //
                    // - name
                    // - price
                    // - total
                    //
                    // The backend obtains the product name and price
                    // directly from SQLite.
                    //
                    // =================================================

                    const items =
                        cartItems.map(
                            item => ({

                                productId:
                                    Number(
                                        item.id ||
                                        item._id
                                    ),

                                quantity:
                                    Number(
                                        item.quantity
                                    )

                            })
                        );


                    // =================================================
                    // VALIDATE CART ITEMS
                    // =================================================

                    const invalidItem =
                        items.some(
                            item => (

                                !Number.isInteger(
                                    item.productId
                                ) ||

                                item.productId <= 0 ||

                                !Number.isInteger(
                                    item.quantity
                                ) ||

                                item.quantity <= 0

                            )
                        );


                    if (
                        invalidItem
                    ) {

                        alert(
                            "One or more products in your cart are invalid. Please refresh the page and try again."
                        );

                        return;

                    }


                    // =================================================
                    // DO NOT CALCULATE THE FINAL ORDER TOTAL HERE
                    // =================================================
                    //
                    // The backend calculates the authoritative total
                    // from the current database product prices.
                    //
                    // The frontend total is only a visual estimate.
                    //
                    // =================================================

                    const orderData = {

                        deliveryAddress,

                        fulfillmentType,

                        items

                    };


                    console.log(
                        "📦 Sending authenticated customer order:",
                        orderData
                    );


                    try {

                        // =================================================
                        // DISABLE BUTTON
                        // =================================================

                        if (submitButton) {

                            submitButton.disabled =
                                true;


                            submitButton.textContent =
                                "Creating Order...";

                        }


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

                        if (submitButton) {

                            submitButton.textContent =
                                "Connecting to Payment...";

                        }


                        console.log(
                            "💳 Payment initialization for Order:",
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
                            String(
                                orderId
                            )
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


                        // =================================================
                        // AUTHENTICATION ERROR
                        // =================================================

                        if (
                            error?.response?.status ===
                            401
                        ) {

                            alert(
                                "Your login session has expired. Please login again."
                            );


                            openCustomerAuth();


                        } else {

                            alert(
                                "Unable to continue to payment.\n\n" +
                                (
                                    error?.response?.data?.message ||
                                    error?.message ||
                                    "Unknown error."
                                )
                            );

                        }


                        if (submitButton) {

                            submitButton.disabled =
                                false;


                            submitButton.textContent =
                                "Continue to Payment";

                        }

                    }

                }
            );

        }


        // =====================================================
        // TRACK ORDER
        // =====================================================

        const trackOrderForm =
            document.getElementById(
                "trackOrderForm"
            );


        if (trackOrderForm) {

            trackOrderForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const input =
                        document.getElementById(
                            "trackOrderNumber"
                        );


                    const result =
                        document.getElementById(
                            "trackOrderResult"
                        );


                    const button =
                        document.getElementById(
                            "trackOrderButton"
                        );


                    const orderId =
                        input?.value
                            ?.trim() || "";


                    if (!orderId) {

                        result.innerHTML = `

                            <div class="alert alert-warning">

                                Please enter your order number.

                            </div>

                        `;

                        return;

                    }


                    // =================================================
                    // CUSTOMER LOGIN REQUIRED
                    // =================================================

                    if (
                        !isCustomerLoggedIn()
                    ) {

                        result.innerHTML = `

                            <div class="alert alert-warning">

                                <i class="bi bi-person-lock me-2"></i>

                                Please login to view your order.

                            </div>

                        `;


                        openCustomerAuth();


                        return;

                    }


                    button.disabled = true;


                    button.innerHTML = `

                        <span
                            class="spinner-border spinner-border-sm me-2"
                        ></span>

                        Loading...

                    `;


                    result.innerHTML = "";


                    try {

                        console.log(
                            "📦 Loading customer order:",
                            orderId
                        );


                        // =================================================
                        // AUTHENTICATED ORDER REQUEST
                        // =================================================
                        //
                        // No phone number is sent.
                        //
                        // Backend uses JWT customer_id.
                        //
                        // =================================================

                        const response =
                            await getOrderById(
                                orderId
                            );


                        console.log(
                            "📦 Customer Order:",
                            response
                        );


                        if (

                            !response ||

                            !response.success ||

                            !response.order

                        ) {

                            throw new Error(
                                response?.message ||
                                "Order not found."
                            );

                        }


                        const order =
                            response.order;


                        // =================================================
                        // STATUS TRACKER
                        // =================================================

                        const statusHTML =
                            buildStatusTracker(
                                order
                            );


                        // =================================================
                        // ITEMS
                        // =================================================

                        const itemsHTML =
                            buildOrderItemsHTML(
                                order
                            );


                        // =================================================
                        // RESULT
                        // =================================================

                        result.innerHTML = `

                            <div
                                class="
                                    border
                                    rounded
                                    p-4
                                    bg-white
                                "
                            >

                                <div
                                    class="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        mb-4
                                    "
                                >

                                    <div>

                                        <h5 class="fw-bold mb-1">

                                            Order #${order.id}

                                        </h5>


                                        <small class="text-muted">

                                            ${order.createdAt || ""}

                                        </small>

                                    </div>


                                    <span
                                        class="
                                            badge
                                            ${
                                                String(
                                                    order.paymentStatus ||
                                                    "pending"
                                                ).toLowerCase() ===
                                                "paid"
                                                    ? "bg-success"
                                                    : "bg-warning text-dark"
                                            }
                                        "
                                    >

                                        ${
                                            String(
                                                order.paymentStatus ||
                                                "pending"
                                            ).toUpperCase()
                                        }

                                    </span>

                                </div>


                                ${statusHTML}


                                <!-- PAYMENT -->

                                <div
                                    class="
                                        bg-light
                                        rounded
                                        p-3
                                        mb-4
                                    "
                                >

                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                            mb-2
                                        "
                                    >

                                        <span>
                                            Payment
                                        </span>


                                        <strong
                                            class="text-success text-uppercase"
                                        >

                                            ${
                                                order.paymentStatus ||
                                                "pending"
                                            }

                                        </strong>

                                    </div>


                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                        "
                                    >

                                        <span>
                                            Total
                                        </span>


                                        <strong>

                                            ${formatNaira(
                                                order.total
                                            )}

                                        </strong>

                                    </div>

                                </div>


                                <!-- ITEMS -->

                                <h6 class="fw-bold mb-2">

                                    Items

                                </h6>


                                <div class="mb-4">

                                    ${itemsHTML}

                                </div>


                                <!-- DELIVERY -->

                                <h6 class="fw-bold mb-2">

                                    ${order.fulfillmentType === "pickup" ? "Fulfilment" : "Delivery Address"}

                                </h6>


                                <div
                                    class="
                                        bg-light
                                        rounded
                                        p-3
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            bi-geo-alt
                                            me-2
                                        "
                                    ></i>


                                    ${
                                        order.fulfillmentType === "pickup"
                                            ? "Customer pickup — no delivery charge"
                                            : order.deliveryAddress || "No delivery address provided."
                                    }

                                </div>

                            </div>

                        `;

                    } catch (error) {

                        console.error(
                            "❌ Track Order Error:",
                            error
                        );


                        result.innerHTML = `

                            <div class="alert alert-danger">

                                <i
                                    class="bi bi-exclamation-circle me-2"
                                ></i>

                                <strong>
                                    Unable to load order
                                </strong>


                                <div class="small mt-1">

                                    ${
                                        error?.response?.data?.message ||
                                        error?.message ||
                                        "Please check the order number and try again."
                                    }

                                </div>

                            </div>

                        `;

                    } finally {

                        button.disabled =
                            false;


                        button.innerHTML = `

                            <i class="bi bi-search me-2"></i>

                            Track Order

                        `;

                    }

                }
            );

        }


        // =====================================================
        // VIEW ORDER BUTTON AFTER PAYMENT
        // =====================================================

        const viewOrderButton =
            document.getElementById(
                "viewOrderButton"
            );


        if (viewOrderButton) {

            viewOrderButton.addEventListener(
                "click",
                async () => {

                    // =================================================
                    // CUSTOMER LOGIN CHECK
                    // =================================================

                    if (
                        !isCustomerLoggedIn()
                    ) {

                        alert(
                            "Please login to view your order."
                        );


                        openCustomerAuth();


                        return;

                    }


                    // =================================================
                    // GET ORDER ID
                    // =================================================

                    const orderId =
                        document
                            .getElementById(
                                "successOrderId"
                            )
                            ?.textContent
                            .replace(
                                "#",
                                ""
                            )
                            .trim();


                    if (!orderId) {

                        alert(
                            "Order number could not be found."
                        );

                        return;

                    }


                    try {

                        console.log(
                            "📦 Loading customer order:",
                            orderId
                        );


                        // =================================================
                        // GET ORDER
                        // =================================================

                        const response =
                            await getOrderById(
                                orderId
                            );


                        console.log(
                            "📦 Order Details:",
                            response
                        );


                        if (

                            !response ||

                            !response.success ||

                            !response.order

                        ) {

                            alert(
                                response?.message ||
                                "Unable to load your order."
                            );

                            return;

                        }


                        const order =
                            response.order;


                        // =================================================
                        // STATUS TRACKER
                        // =================================================

                        const statusTracker =
                            buildStatusTracker(
                                order
                            );


                        // =================================================
                        // ORDER ITEMS
                        // =================================================

                        const itemsHTML =
                            buildOrderItemsHTML(
                                order
                            );


                        // =================================================
                        // REMOVE OLD MODAL
                        // =================================================

                        const existingModal =
                            document.getElementById(
                                "customerOrderDetailsModal"
                            );


                        if (existingModal) {

                            existingModal.remove();

                        }


                        // =================================================
                        // CREATE ORDER DETAILS MODAL
                        // =================================================

                        const modalHTML = `

                            <div
                                class="modal fade"
                                id="customerOrderDetailsModal"
                                tabindex="-1"
                                aria-hidden="true"
                            >

                                <div
                                    class="
                                        modal-dialog
                                        modal-dialog-centered
                                        modal-dialog-scrollable
                                    "
                                >

                                    <div
                                        class="
                                            modal-content
                                            border-0
                                            shadow-lg
                                        "
                                    >

                                        <div class="modal-header">

                                            <div>

                                                <h5
                                                    class="
                                                        modal-title
                                                        fw-bold
                                                        mb-1
                                                    "
                                                >

                                                    Order #${order.id}

                                                </h5>


                                                <small class="text-muted">

                                                    ${order.createdAt || ""}

                                                </small>

                                            </div>


                                            <button
                                                type="button"
                                                class="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>

                                        </div>


                                        <div class="modal-body">

                                            ${statusTracker}


                                            <!-- PAYMENT -->

                                            <div
                                                class="
                                                    bg-light
                                                    rounded
                                                    p-3
                                                    mb-4
                                                "
                                            >

                                                <div
                                                    class="
                                                        d-flex
                                                        justify-content-between
                                                        mb-2
                                                    "
                                                >

                                                    <span>
                                                        Payment
                                                    </span>


                                                    <strong
                                                        class="
                                                            text-success
                                                            text-uppercase
                                                        "
                                                    >

                                                        ${
                                                            order.paymentStatus ||
                                                            "pending"
                                                        }

                                                    </strong>

                                                </div>


                                                <div
                                                    class="
                                                        d-flex
                                                        justify-content-between
                                                    "
                                                >

                                                    <span>
                                                        Total
                                                    </span>


                                                    <strong>

                                                        ${formatNaira(
                                                            order.total
                                                        )}

                                                    </strong>

                                                </div>

                                            </div>


                                            <!-- ITEMS -->

                                            <h6 class="fw-bold">

                                                Items

                                            </h6>


                                            <div class="mb-4">

                                                ${itemsHTML}

                                            </div>


                                            <!-- DELIVERY -->

                                            <h6 class="fw-bold">

                                                ${order.fulfillmentType === "pickup" ? "Fulfilment" : "Delivery Address"}

                                            </h6>


                                            <div
                                                class="
                                                    bg-light
                                                    rounded
                                                    p-3
                                                    mb-2
                                                "
                                            >

                                                <i
                                                    class="
                                                        bi
                                                        bi-geo-alt
                                                        me-2
                                                    "
                                                ></i>


                                                ${
                                                    order.fulfillmentType === "pickup"
                                                        ? "Customer pickup — no delivery charge"
                                                        : order.deliveryAddress || "No delivery address provided."
                                                }

                                            </div>

                                        </div>


                                        <div class="modal-footer">

                                            <button
                                                type="button"
                                                class="btn btn-dark"
                                                data-bs-dismiss="modal"
                                            >

                                                Close

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        `;


                        // =================================================
                        // ADD MODAL
                        // =================================================

                        document.body.insertAdjacentHTML(
                            "beforeend",
                            modalHTML
                        );


                        const modalElement =
                            document.getElementById(
                                "customerOrderDetailsModal"
                            );


                        const modal =
                            new bootstrap.Modal(
                                modalElement
                            );


                        modal.show();


                        // =================================================
                        // REMOVE AFTER CLOSE
                        // =================================================

                        modalElement.addEventListener(
                            "hidden.bs.modal",
                            () => {

                                modalElement.remove();

                            },
                            {
                                once: true
                            }
                        );

                    } catch (error) {

                        console.error(
                            "❌ Unable to load order:",
                            error
                        );


                        if (
                            error?.response?.status ===
                            401
                        ) {

                            alert(
                                "Your login session has expired. Please login again."
                            );


                            openCustomerAuth();


                        } else {

                            alert(
                                error?.response?.data?.message ||
                                "Unable to load your order. Please try again."
                            );

                        }

                    }

                }
            );

        }

    } catch (error) {

        console.error(
            "❌ Application initialization failed:",
            error
        );


        const app =
            document.querySelector(
                "#app"
            );


        if (app) {

            app.innerHTML = `

                <div class="container py-5">

                    <div class="alert alert-danger">

                        <h4>
                            Unable to load NutriDust Foods
                        </h4>


                        <p class="mb-0">

                            ${
                                error?.message ||
                                "An unexpected error occurred."
                            }

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

init().then(()=>setInterval(()=>{if(!document.hidden)refreshCustomerProductsSilently().catch(()=>{});},3000));
