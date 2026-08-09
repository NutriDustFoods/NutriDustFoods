export function ProductModal() {

    return `

<div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-xl modal-dialog-centered">

        <div class="modal-content bg-dark text-white border-warning">

            <div class="modal-header border-warning">

                <h3 class="modal-title text-warning">

                    Product Details

                </h3>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="row align-items-center">

                    <div class="col-lg-5 text-center">

                        <img
                            id="modalImage"
                            class="img-fluid rounded shadow product-modal-image"
                            alt="Product">

                    </div>

                    <div class="col-lg-7">

                        <span
                            id="modalCategory"
                            class="badge bg-secondary mb-2">

                            Category

                        </span>

                        <h1
                            id="modalTitle"
                            class="fw-bold mb-3">
                        </h1>

                        <div
                            id="modalRating"
                            class="mb-3 fs-4">
                        </div>

                        <h2
                            id="modalPrice"
                            class="text-warning fw-bold mb-4">
                        </h2>

                        <p
                            id="modalDescription"
                            class="text-light fs-5">
                        </p>

                        <div class="d-flex align-items-center gap-3 my-4">

                            <button
                                id="qtyMinus"
                                class="btn btn-outline-warning">

                                <i class="bi bi-dash-lg"></i>

                            </button>

                            <h3 id="modalQty">1</h3>

                            <button
                                id="qtyPlus"
                                class="btn btn-outline-warning">

                                <i class="bi bi-plus-lg"></i>

                            </button>

                        </div>

                        <div class="d-grid gap-3">

                            <button
                                id="modalAddToCart"
                                class="btn btn-warning btn-lg">

                                <i class="bi bi-cart-plus"></i>

                                Add to Cart

                            </button>

                            <button
                                class="btn btn-outline-light">

                                <i class="bi bi-heart"></i>

                                Add to Wishlist

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

`;

}