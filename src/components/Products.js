import { getProducts } from "../services/api.js";
import { createStars } from "../utils/rating.js";


// =====================================================
// API SERVER
// =====================================================

const API_BASE_URL =
    "http://localhost:5000";


// =====================================================
// PRODUCT IMAGE URL
// =====================================================

function getProductImageUrl(image) {

    if (!image) {

        return "";

    }


    // If the backend ever returns a complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Backend returns paths such as:
    // /uploads/products/example.png

    return `${API_BASE_URL}${image}`;

}


// =====================================================
// PRODUCTS
// =====================================================

export async function Products() {

    const products =
        await getProducts();


    console.log(
        "Customer products:",
        products
    );


    const cards =
        products.map(product => {

            const imageUrl =
                getProductImageUrl(
                    product.image
                );


            return `

                <div class="col-lg-4 col-md-6">

                    <div class="card product-card h-100">

                        <div class="position-relative">

                            ${
                                imageUrl
                                    ? `

                                        <img
                                            src="${imageUrl}"
                                            class="card-img-top"
                                            alt="${product.name}"
                                            style="
                                                width:100%;
                                                height:280px;
                                                object-fit:cover;
                                            "
                                        >

                                    `
                                    : `

                                        <div
                                            class="d-flex align-items-center justify-content-center bg-light"
                                            style="
                                                width:100%;
                                                height:280px;
                                            "
                                        >

                                            <i
                                                class="bi bi-image text-muted"
                                                style="
                                                    font-size:50px;
                                                "
                                            ></i>

                                        </div>

                                    `
                            }


                            <span
                                class="badge bg-warning text-dark position-absolute top-0 start-0 m-3"
                            >

                                ${product.badge || "NEW"}

                            </span>

                        </div>


                        <div class="card-body">


                            <!-- CATEGORY -->

                            <span
                                class="badge bg-secondary"
                            >

                                ${product.category || ""}

                            </span>


                            <!-- PRODUCT NAME -->

                            <h4 class="mt-3">

                                ${product.name}

                            </h4>


                            <!-- RATING -->

                            <div class="mb-3">

                                ${createStars(
                                    product.rating
                                )}

                            </div>


                            <!-- DESCRIPTION -->

                            <p>

                                ${product.description || ""}

                            </p>


                            <!-- PRICE -->

                            <h3
                                class="text-warning fw-bold"
                            >

                                ₦${Number(
                                    product.price || 0
                                ).toLocaleString()}

                            </h3>


                            <!-- BUTTONS -->

                            <div
                                class="d-grid gap-2"
                            >

                                <button
                                    class="btn btn-warning view-product"
                                    data-id="${product.id}"
                                >

                                    View Details

                                </button>


                                <button
                                    class="btn btn-success add-to-cart"
                                    data-id="${product.id}"
                                >

                                    <i
                                        class="bi bi-cart-plus"
                                    ></i>

                                    Add to Cart

                                </button>

                            </div>


                        </div>

                    </div>

                </div>

            `;

        }).join("");


    return `

        <section
            id="products"
            class="products py-5"
        >

            <div class="container">


                <!-- SECTION HEADER -->

                <div
                    class="text-center mb-5"
                >

                    <h2
                        class="display-4 fw-bold text-warning"
                    >

                        Featured Products

                    </h2>


                    <p class="text-light">

                        Explore our premium range
                        of nutritious products.

                    </p>

                </div>


                <!-- PRODUCTS -->

                <div class="row g-4">

                    ${cards}

                </div>


            </div>

        </section>

    `;

}