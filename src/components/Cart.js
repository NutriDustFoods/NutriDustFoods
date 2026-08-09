export function Cart() {

    return `

<div
    id="cart"
    class="offcanvas offcanvas-end text-bg-dark"
    tabindex="-1"
    aria-labelledby="cartTitle">

    <div class="offcanvas-header border-bottom border-secondary">

        <h4
            id="cartTitle"
            class="offcanvas-title text-warning fw-bold">

            <i class="bi bi-cart3 me-2"></i>

            Shopping Cart

        </h4>

        <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close">
        </button>

    </div>

    <div class="offcanvas-body">

        <div id="cartItems">

            <div class="text-center py-5">

                <i
                    class="bi bi-cart-x display-1 text-secondary">
                </i>

                <p class="mt-3 text-secondary">

                    Your cart is empty.

                </p>

            </div>

        </div>

        <hr>

        <div
            class="d-flex justify-content-between align-items-center">

            <h4 class="mb-0">

                Total

            </h4>

            <h4
                id="cartTotal"
                class="text-warning fw-bold mb-0">

                ₦0

            </h4>

        </div>

        <button
            id="checkoutButton"
            class="btn btn-warning w-100 mt-4">

            <i class="bi bi-credit-card me-2"></i>

            Proceed to Checkout

        </button>

    </div>

</div>

`;

}