import { getProducts } from "../services/api.js";
import { createStars } from "../utils/rating.js";

export async function Products() {

    const products = await getProducts();

    console.log(products);
    
    const cards = products.map(product => `

    <div class="col-lg-4 col-md-6">

        <div class="card product-card h-100">

            <div class="position-relative">

                <img
                    src="/products/${product.image}"
                    class="card-img-top"
                    alt="${product.name}">

                <span class="badge bg-warning text-dark position-absolute top-0 start-0 m-3">

                    ${product.badge}

                </span>

            </div>

            <div class="card-body">

                <span class="badge bg-secondary">

                    ${product.category}

                </span>

                <h4 class="mt-3">

                    ${product.name}

                </h4>

                <div class="mb-3">

                    ${createStars(product.rating)}

                </div>

                <p>

                    ${product.description}

                </p>

                <h3 class="text-warning fw-bold">

                    ₦${Number(product.price).toLocaleString()}

                </h3>

                <div class="d-grid gap-2">

                    <button
                    class="btn btn-warning view-product"
                    data-id="${product._id}">

                    View Details

                    </button>

                    <button
                    class="btn btn-success add-to-cart"
                    data-id="${product._id}">

                    <i class="bi bi-cart-plus"></i>

                    Add to Cart

                    </button>

                </div>

            </div>

        </div>

    </div>

    `).join("");

    return `

<section id="products" class="products py-5">

<div class="container">

<div class="text-center mb-5">

<h2 class="display-4 fw-bold text-warning">

Featured Products

</h2>

<p class="text-light">

Explore our premium range of nutritious products.

</p>

</div>

<div class="row g-4">

${cards}

</div>

</div>

</section>

`;

}