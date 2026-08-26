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

    const cart = getCart();

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    const cartCount =
        document.getElementById("cartCount");


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

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="nutridust-cart-empty">

                <div class="nutridust-cart-empty-icon">

                    <i class="bi bi-cart-x"></i>

                </div>

                <h5>
                    Your cart is empty
                </h5>

                <p>
                    Add some delicious NutriDust products
                    to get started.
                </p>

            </div>

        `;

        cartTotal.textContent = "₦0";

        return;
    }


    // =================================================
    // TOTAL
    // =================================================

    let total = 0;

    cartItems.innerHTML = "";


    // =================================================
    // RENDER PRODUCTS
    // =================================================

    cart.forEach(item => {

        // =============================================
        // PRODUCT ID
        // =============================================

        const productId =
            item._id ||
            item.id;


        // =============================================
        // QUANTITY
        // =============================================

        const quantity =
            Number(item.quantity || 0);


        // =============================================
        // AVAILABLE STOCK
        // =============================================

        const availableStock =
            Number(
                item.quantityAvailable ?? 0
            );


        // =============================================
        // REMAINING STOCK
        // =============================================

        const remainingStock =
            Math.max(
                0,
                availableStock - quantity
            );


        // =============================================
        // PRICE
        // =============================================

        const price =
            Number(item.price || 0);


        // =============================================
        // SUBTOTAL
        // =============================================

        const subtotal =
            price * quantity;


        total += subtotal;


        // =============================================
        // MAXIMUM QUANTITY
        // =============================================

        const maximumReached =
            quantity >= availableStock;


        // =============================================
        // PRODUCT IMAGE
        // =============================================

        let imageUrl =
            item.image ||
            item.imageUrl ||
            item.productImage ||
            "";


        // =============================================
        // CONVERT BACKEND IMAGE PATH
        // =============================================

        if (
            imageUrl &&
            !imageUrl.startsWith("http") &&
            !imageUrl.startsWith("data:")
        ) {

            imageUrl =
                `http://localhost:5000${imageUrl}`;

        }


        // =============================================
        // IMAGE HTML
        // =============================================

        const imageHtml =
    imageUrl

        ? `

            <div
                style="
                    width:70px;
                    height:70px;
                    min-width:70px;
                    max-width:70px;
                    min-height:70px;
                    max-height:70px;
                    flex:0 0 70px;
                    overflow:hidden;
                    border-radius:8px;
                    background:#222;
                "
            >

                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="${escapeHtml(item.name)}"
                    style="
                        width:70px;
                        height:70px;
                        max-width:70px;
                        max-height:70px;
                        min-width:70px;
                        min-height:70px;
                        object-fit:cover;
                        display:block;
                    "
                    onerror="this.style.display='none';"
                >

            </div>

        `

        : `

    <div
        style="
            width:70px;
            height:70px;
            min-width:70px;
            max-width:70px;
            min-height:70px;
            max-height:70px;
            flex:0 0 70px;
            border-radius:8px;
            background:#222;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#777;
        "
    >

        <i class="bi bi-box-seam"></i>

    </div>

`;


        // =============================================
        // STOCK STATUS
        // =============================================

        let stockHtml = "";


        if (availableStock <= 0) {

            stockHtml = `

                <div class="nutridust-stock-danger">

                    <i class="bi bi-x-circle-fill"></i>

                    <span>
                        Out of stock
                    </span>

                </div>

            `;

        }

        else if (remainingStock <= 0) {

            stockHtml = `

                <div class="nutridust-stock-warning">

                    <i class="bi bi-exclamation-circle-fill"></i>

                    <span>
                        Maximum available quantity selected
                    </span>

                </div>

            `;

        }

        else {

            stockHtml = `

                <div class="nutridust-stock-success">

                    <i class="bi bi-box-seam-fill"></i>

                    <span>
                        ${remainingStock.toLocaleString()}
                        available
                    </span>

                </div>

            `;

        }


        // =============================================
        // CART ITEM
        // =============================================

        cartItems.innerHTML += `

            <div class="nutridust-cart-item">


                <!-- ================================= -->
                <!-- PRODUCT INFORMATION -->
                <!-- ================================= -->

                <div class="nutridust-cart-product">


                    <!-- ============================= -->
                    <!-- PRODUCT IMAGE -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-image-wrapper">

                        ${imageHtml}

                    </div>


                    <!-- ============================= -->
                    <!-- PRODUCT DETAILS -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-product-info">

                        <h5 class="nutridust-cart-product-name">

                            ${escapeHtml(
                                item.name
                            )}

                        </h5>


                        <div class="nutridust-cart-unit-price">

                            ₦${price.toLocaleString()}

                            <span>
                                each
                            </span>

                        </div>


                        ${stockHtml}

                    </div>


                    <!-- ============================= -->
                    <!-- SUBTOTAL -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-subtotal">

                        ₦${subtotal.toLocaleString()}

                    </div>


                </div>


                <!-- ================================= -->
                <!-- QUANTITY CONTROLS -->
                <!-- ================================= -->

                <div class="nutridust-cart-controls-row">


                    <span class="nutridust-cart-quantity-label">

                        Quantity

                    </span>


                    <div class="nutridust-cart-quantity-controls">


                        <!-- DECREASE -->

                        <button
                            class="nutridust-cart-quantity-btn decrease-btn"
                            data-id="${escapeHtml(productId)}"
                            type="button"
                            ${
                                quantity <= 1
                                    ? "disabled"
                                    : ""
                            }
                            aria-label="Decrease quantity"
                        >

                            <i class="bi bi-dash"></i>

                        </button>


                        <!-- QUANTITY -->

                        <div class="nutridust-cart-quantity">

                            ${quantity}

                        </div>


                        <!-- INCREASE -->

                        <button
                            class="nutridust-cart-quantity-btn increase-btn"
                            data-id="${escapeHtml(productId)}"
                            type="button"
                            ${
                                maximumReached ||
                                availableStock <= 0
                                    ? "disabled"
                                    : ""
                            }
                            aria-label="Increase quantity"
                        >

                            <i class="bi bi-plus"></i>

                        </button>


                    </div>


                    <span class="nutridust-cart-stock-total">

                        ${availableStock.toLocaleString()}
                        total stock

                    </span>

                </div>


            </div>

        `;

    });


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
        .querySelectorAll(".increase-btn")
        .forEach(button => {

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

        });


    // =================================================
    // DECREASE QUANTITY
    // =================================================

    document
        .querySelectorAll(".decrease-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    decreaseQuantity(
                        button.dataset.id
                    );

                    renderCart();

                }
            );

        });

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value ?? "")

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