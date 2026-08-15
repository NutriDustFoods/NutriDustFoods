import {
    getCart,
    getCartCount,
    increaseQuantity,
    decreaseQuantity
} from "../services/cartService.js";


// =====================================================
// RENDER CART
// =====================================================

export function renderCart() {

    const cart =
        getCart();

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    // =================================================
    // CHECK CART ELEMENTS
    // =================================================

    if (
        !cartItems ||
        !cartTotal ||
        !cartCount
    ) {

        return;

    }


    // =================================================
    // CART COUNT
    // =================================================

    cartCount.textContent =
        getCartCount();


    // =================================================
    // EMPTY CART
    // =================================================

    if (
        cart.length === 0
    ) {

        cartItems.innerHTML = `

            <div class="text-center py-5">

                <i
                    class="bi bi-cart-x display-1 text-secondary"
                ></i>

                <p class="text-secondary mt-3">

                    Your cart is empty.

                </p>

            </div>

        `;


        cartTotal.textContent =
            "₦0";


        return;

    }


    // =================================================
    // CALCULATE TOTAL
    // =================================================

    let total = 0;


    cartItems.innerHTML = "";


    // =================================================
    // RENDER CART ITEMS
    // =================================================

    cart.forEach(
        item => {

            // =========================================
            // PRODUCT ID
            // =========================================

            const productId =
                item._id ||
                item.id;


            // =========================================
            // QUANTITY IN CART
            // =========================================

            const quantity =
                Number(
                    item.quantity || 0
                );


            // =========================================
            // ORIGINAL AVAILABLE STOCK
            //
            // This is the stock currently returned
            // by the backend.
            //
            // Example:
            //
            // Stock = 780
            // Quantity = 2
            //
            // Remaining = 780 - 2 = 778
            // =========================================

            const availableStock =
                Number(
                    item.quantityAvailable ?? 0
                );


            // =========================================
            // REMAINING STOCK
            //
            // We DO NOT permanently change the database
            // here.
            //
            // This is only the amount displayed to the
            // customer while they are shopping.
            // =========================================

            const remainingStock =
                Math.max(
                    0,
                    availableStock - quantity
                );


            // =========================================
            // PRICE
            // =========================================

            const price =
                Number(
                    item.price || 0
                );


            // =========================================
            // SUBTOTAL
            // =========================================

            const subtotal =
                price *
                quantity;


            total +=
                subtotal;


            // =========================================
            // CHECK MAXIMUM QUANTITY
            //
            // Customer cannot select more than the
            // original available stock.
            // =========================================

            const maximumReached =
                quantity >=
                availableStock;


            // =========================================
            // STOCK MESSAGE
            // =========================================

            let stockMessage = "";


            // =========================================
            // OUT OF STOCK
            // =========================================

            if (
                availableStock <= 0
            ) {

                stockMessage = `

                    <div
                        class="alert alert-danger py-2 px-3 mb-2"
                    >

                        <i
                            class="bi bi-x-circle-fill me-1"
                        ></i>

                        <strong>
                            Out of Stock
                        </strong>

                    </div>

                `;

            }


            // =========================================
            // NO STOCK REMAINING FOR MORE UNITS
            // =========================================

            else if (
                remainingStock <= 0
            ) {

                stockMessage = `

                    <div
                        class="alert alert-warning py-2 px-3 mb-2"
                    >

                        <i
                            class="bi bi-exclamation-triangle-fill me-1"
                        ></i>

                        <strong>
                            No more stock available
                        </strong>

                        <div class="small mt-1">

                            You have selected all
                            ${availableStock.toLocaleString()}
                            available unit(s).

                        </div>

                    </div>

                `;

            }


            // =========================================
            // REMAINING STOCK
            // =========================================

            else {

                stockMessage = `

                    <div
                        class="text-success small mb-2"
                    >

                        <i
                            class="bi bi-box-seam me-1"
                        ></i>

                        <strong>
                            ${remainingStock.toLocaleString()}
                        </strong>

                        available

                    </div>

                `;

            }


            // =========================================
            // CART ITEM
            // =========================================

            cartItems.innerHTML += `

                <div
                    class="card bg-secondary text-white mb-3"
                >

                    <div class="card-body">


                        <!-- ================================= -->
                        <!-- PRODUCT INFORMATION -->
                        <!-- ================================= -->

                        <div
                            class="d-flex justify-content-between align-items-start"
                        >

                            <div>

                                <h5
                                    class="text-warning mb-1"
                                >

                                    ${escapeHtml(
                                        item.name
                                    )}

                                </h5>


                                <p class="mb-1">

                                    ₦${price.toLocaleString()}

                                    <small>
                                        each
                                    </small>

                                </p>

                            </div>


                            <h5>

                                ₦${subtotal.toLocaleString()}

                            </h5>

                        </div>


                        <!-- ================================= -->
                        <!-- STOCK INFORMATION -->
                        <!-- ================================= -->

                        ${stockMessage}


                        <!-- ================================= -->
                        <!-- QUANTITY CONTROLS -->
                        <!-- ================================= -->

                        <div
                            class="d-flex align-items-center gap-2 mt-3"
                        >


                            <!-- ============================= -->
                            <!-- DECREASE -->
                            <!-- ============================= -->

                            <button
                                class="btn btn-danger decrease-btn"
                                data-id="${escapeHtml(
                                    productId
                                )}"
                                type="button"
                                ${
                                    quantity <= 1
                                        ? "disabled"
                                        : ""
                                }
                            >

                                <i
                                    class="bi bi-dash"
                                ></i>

                            </button>


                            <!-- ============================= -->
                            <!-- CURRENT QUANTITY -->
                            <!-- ============================= -->

                            <div
                                class="px-3 py-2 bg-dark rounded text-center"
                                style="min-width:90px;"
                            >

                                <strong>

                                    ${quantity}

                                </strong>


                                <small
                                    class="text-secondary d-block"
                                >

                                    of
                                    ${availableStock.toLocaleString()}

                                </small>

                            </div>


                            <!-- ============================= -->
                            <!-- INCREASE -->
                            <!-- ============================= -->

                            <button
                                class="btn btn-success increase-btn"
                                data-id="${escapeHtml(
                                    productId
                                )}"
                                type="button"

                                ${
                                    maximumReached ||
                                    availableStock <= 0
                                        ? "disabled"
                                        : ""
                                }

                            >

                                <i
                                    class="bi bi-plus"
                                ></i>

                            </button>


                        </div>


                    </div>

                </div>

            `;

        }
    );


    // =================================================
    // CART TOTAL
    // =================================================

    cartTotal.textContent =
        "₦" +
        total.toLocaleString();


    // =================================================
    // INCREASE QUANTITY
    // =================================================

    document
        .querySelectorAll(
            ".increase-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const result =
                            increaseQuantity(
                                button.dataset.id
                            );


                        if (
                            result &&
                            !result.success &&
                            result.message
                        ) {

                            alert(
                                result.message
                            );

                        }


                        renderCart();

                    }
                );

            }
        );


    // =================================================
    // DECREASE QUANTITY
    // =================================================

    document
        .querySelectorAll(
            ".decrease-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        decreaseQuantity(
                            button.dataset.id
                        );


                        renderCart();

                    }
                );

            }
        );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}