export function TrackOrder() {
    return `
        <section
            id="trackOrderSection"
            class="container py-5"
        >

            <div class="text-center mb-4">

                <span
                    class="text-uppercase fw-bold"
                    style="
                        color: #d4a017;
                        letter-spacing: 2px;
                    "
                >
                    Order Tracking
                </span>

                <h2 class="fw-bold mt-2">
                    Track My Order
                </h2>

                <p class="text-muted">
                    Enter your order number to see the current
                    status of your order.
                </p>

            </div>


            <div
                class="card border-0 shadow-sm mx-auto"
                style="max-width: 600px;"
            >

                <div class="card-body p-4">

                    <form id="trackOrderForm">

                        <label
                            for="trackOrderNumber"
                            class="form-label fw-semibold"
                        >
                            Order Number
                        </label>

                        <div class="input-group">

                            <span class="input-group-text">
                                #
                            </span>

                            <input
                                type="number"
                                class="form-control"
                                id="trackOrderNumber"
                                placeholder="Enter order number"
                                min="1"
                                required
                            />

                            <button
                                type="submit"
                                class="btn btn-dark"
                                id="trackOrderButton"
                            >
                                <i class="bi bi-search me-2"></i>
                                Track Order
                            </button>

                        </div>

                    </form>


                    <div
                        id="trackOrderResult"
                        class="mt-4"
                    ></div>

                </div>

            </div>

        </section>
    `;
}