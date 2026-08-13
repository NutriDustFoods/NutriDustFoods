export function PaymentSuccess() {
    return `
        <div
            class="modal fade"
            id="paymentSuccessModal"
            tabindex="-1"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">

                    <div class="modal-body text-center p-5">

                        <div
                            class="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                            style="
                                width: 80px;
                                height: 80px;
                                background: #d1e7dd;
                            "
                        >
                            <i
                                class="bi bi-check-lg text-success"
                                style="font-size: 3rem;"
                            ></i>
                        </div>

                        <h2 class="fw-bold mb-2">
                            Payment Successful!
                        </h2>

                        <p class="text-muted mb-4">
                            Thank you for shopping with
                            <strong>NutriDust Foods</strong>.
                        </p>

                        <div class="bg-light rounded p-3 mb-4 text-start">

                            <div class="d-flex justify-content-between mb-2">
                                <span>Order Number</span>
                                <strong id="successOrderId">
                                    —
                                </strong>
                            </div>

                            <div class="d-flex justify-content-between">
                                <span>Total Paid</span>
                                <strong id="successOrderAmount">
                                    —
                                </strong>
                            </div>

                        </div>

                        <div class="d-grid gap-2">

                            <button
                                type="button"
                                class="btn btn-dark"
                                id="viewOrderButton"
                            >
                                <i class="bi bi-receipt me-2"></i>
                                View Order
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    `;
}