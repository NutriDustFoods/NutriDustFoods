import { getProducts } from "../services/api.js";
import { createStars } from "../utils/rating.js";


// =====================================================
// API SERVER
// =====================================================

const API_BASE_URL = __API_ORIGIN__;


// =====================================================
// PRODUCT IMAGE URL
// =====================================================

function getProductImageUrl(image) {

    if (!image) {

        return "";

    }


    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    return `${API_BASE_URL}${image}`;

}


// =====================================================
// STOCK DISPLAY
// =====================================================

function getStockDisplay(product) {

    const quantity =
        Number(
            product.quantityAvailable ?? 0
        );


    // -------------------------------------------------
    // OUT OF STOCK
    // -------------------------------------------------

    if (quantity <= 0) {

        return `

            <div
                class="alert alert-danger py-2 px-3 mb-3"
            >

                <i class="bi bi-x-circle-fill me-1"></i>

                <strong>
                    Out of Stock
                </strong>

            </div>

        `;

    }


    // -------------------------------------------------
    // VERY LOW STOCK
    // -------------------------------------------------

    if (quantity <= 5) {

        return `

            <div
                class="alert alert-danger py-2 px-3 mb-3"
            >

                <i class="bi bi-exclamation-triangle-fill me-1"></i>

                <strong>
                    Only ${quantity.toLocaleString()} left!
                </strong>

            </div>

        `;

    }


    // -------------------------------------------------
    // LOW STOCK
    // -------------------------------------------------

    if (
        quantity <=
        Number(
            product.lowStockThreshold ?? 10
        )
    ) {

        return `

            <div
                class="alert alert-warning py-2 px-3 mb-3"
            >

                <i class="bi bi-exclamation-circle-fill me-1"></i>

                <strong>
                    Only ${quantity.toLocaleString()} left
                </strong>

            </div>

        `;

    }


    // -------------------------------------------------
    // NORMAL STOCK
    // -------------------------------------------------

    return `

        <div
            class="text-success fw-semibold mb-3"
        >

            <i class="bi bi-check-circle-fill me-1"></i>

            ${quantity.toLocaleString()} available

        </div>

    `;

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


            const quantity =
                Number(
                    product.quantityAvailable ?? 0
                );


            const isOutOfStock =
                quantity <= 0;


            return `

                <div class="col-lg-4 col-md-6">

                    <div class="card product-card h-100" data-product-card="${product.id}">

                        <!-- ================================================= -->
                        <!-- IMAGE -->
                        <!-- ================================================= -->

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


                            <!-- PRODUCT BADGE -->

                            <span
                                class="badge bg-warning text-dark position-absolute top-0 start-0 m-3"
                            >

                                ${product.badge || "NEW"}

                            </span>


                            <!-- OUT OF STOCK OVERLAY -->

                            ${
                                isOutOfStock
                                    ? `

                                        <div
                                            class="position-absolute top-50 start-50 translate-middle w-100 text-center"
                                        >

                                            <span
                                                class="badge bg-danger fs-6 px-3 py-2"
                                            >

                                                OUT OF STOCK

                                            </span>

                                        </div>

                                    `
                                    : ""
                            }

                        </div>


                        <!-- ================================================= -->
                        <!-- BODY -->
                        <!-- ================================================= -->

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
                                class="text-warning fw-bold" data-product-price
                            >

                                ₦${Number(
                                    product.price || 0
                                ).toLocaleString()}

                            </h3>


                            <!-- ================================================= -->
                            <!-- STOCK -->
                            <!-- ================================================= -->

                            <div data-product-stock>${getStockDisplay(product)}</div>


                            <!-- ================================================= -->
                            <!-- BUTTONS -->
                            <!-- ================================================= -->

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
                                    ${
                                        isOutOfStock
                                            ? "disabled"
                                            : ""
                                    }
                                >

                                    <i
                                        class="bi bi-cart-plus"
                                    ></i>

                                    ${
                                        isOutOfStock
                                            ? "Out of Stock"
                                            : "Add to Cart"
                                    }

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

export async function refreshCustomerProductsSilently() {
    const products=await getProducts();
    products.forEach(product=>{
        const card=document.querySelector(`[data-product-card="${product.id}"]`);
        if(!card)return;
        const stock=card.querySelector("[data-product-stock]"),stockHtml=getStockDisplay(product);
        if(stock&&stock.innerHTML!==stockHtml)stock.innerHTML=stockHtml;
        const price=card.querySelector("[data-product-price]"),priceText=`₦${Number(product.price||0).toLocaleString()}`;
        if(price&&price.textContent.trim()!==priceText)price.textContent=priceText;
        const add=card.querySelector(".add-to-cart"),out=Number(product.quantityAvailable??0)<=0;
        if(add){add.disabled=out;add.innerHTML=out?'Out of Stock':'<i class="bi bi-cart-plus"></i> Add to Cart';}
    });
}
