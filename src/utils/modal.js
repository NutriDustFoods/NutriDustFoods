import * as bootstrap from "bootstrap";

import {
    addToCart
} from "../services/cartService.js";

import {
    renderCart
} from "./cartUI.js";


// =====================================================
// API SERVER
// =====================================================

const API_BASE_URL = __API_ORIGIN__;


// =====================================================
// CURRENT PRODUCT
// =====================================================

let currentProduct = null;

let quantity = 1;


// =====================================================
// PRODUCT IMAGE URL
// =====================================================

function getProductImageUrl(image) {

    // -------------------------------------------------
    // No image
    // -------------------------------------------------

    if (!image) {

        return "";

    }


    // -------------------------------------------------
    // Convert to string
    // -------------------------------------------------

    const imageValue =
        String(image).trim();


    // -------------------------------------------------
    // Empty image
    // -------------------------------------------------

    if (!imageValue) {

        return "";

    }


    // -------------------------------------------------
    // Already a complete URL
    // -------------------------------------------------

    if (
        imageValue.startsWith("http://") ||
        imageValue.startsWith("https://") ||
        imageValue.startsWith("data:")
    ) {

        return imageValue;

    }


    // -------------------------------------------------
    // Backend already returned a complete upload path
    //
    // Example:
    // /uploads/products/beef-jerky.png
    // -------------------------------------------------

    if (
        imageValue.startsWith("/uploads/")
    ) {

        return (
            API_BASE_URL +
            imageValue
        );

    }


    // -------------------------------------------------
    // Backend returned:
    //
    // uploads/products/beef-jerky.png
    // -------------------------------------------------

    if (
        imageValue.startsWith("uploads/")
    ) {

        return (
            API_BASE_URL +
            "/" +
            imageValue
        );

    }


    // -------------------------------------------------
    // Backend returned only filename:
    //
    // beef-jerky.png
    //
    // Use the backend products upload folder.
    // -------------------------------------------------

    return (
        `${API_BASE_URL}/uploads/products/${imageValue}`
    );

}


// =====================================================
// SHOW PRODUCT
// =====================================================

export function showProduct(
    product
) {

    if (!product) {

        console.error(
            "❌ Cannot show product: product not found."
        );

        return;

    }


    // -------------------------------------------------
    // Store product
    // -------------------------------------------------

    currentProduct =
        product;


    // -------------------------------------------------
    // Reset quantity
    // -------------------------------------------------

    quantity = 1;


    // -------------------------------------------------
    // Get modal elements
    // -------------------------------------------------

    const modalElement =
        document.getElementById(
            "productModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalCategory =
        document.getElementById(
            "modalCategory"
        );


    const modalTitle =
        document.getElementById(
            "modalTitle"
        );


    const modalPrice =
        document.getElementById(
            "modalPrice"
        );


    const modalDescription =
        document.getElementById(
            "modalDescription"
        );


    const modalQty =
        document.getElementById(
            "modalQty"
        );


    const modalRating =
        document.getElementById(
            "modalRating"
        );


    const addButton =
        document.getElementById(
            "modalAddToCart"
        );


    // -------------------------------------------------
    // Make sure modal exists
    // -------------------------------------------------

    if (!modalElement) {

        console.error(
            "❌ Product modal element not found."
        );

        return;

    }


    // -------------------------------------------------
    // IMAGE
    // -------------------------------------------------

    const imageUrl =
        getProductImageUrl(
            product.image
        );


    console.log(
        "🖼️ Product image:",
        product.image
    );


    console.log(
        "🖼️ Modal image URL:",
        imageUrl
    );


    if (modalImage) {

        if (imageUrl) {

            modalImage.src =
                imageUrl;


            modalImage.alt =
                product.name || "Product";


            modalImage.style.display =
                "block";


            // -------------------------------------------------
            // Image error fallback
            // -------------------------------------------------

            modalImage.onerror = () => {

                console.error(
                    "❌ Product modal image failed:",
                    imageUrl
                );


                modalImage.removeAttribute(
                    "src"
                );


                modalImage.style.display =
                    "none";


                const imageContainer =
                    modalImage.parentElement;


                if (
                    imageContainer &&
                    !imageContainer.querySelector(
                        ".modal-image-fallback"
                    )
                ) {

                    imageContainer.insertAdjacentHTML(
                        "beforeend",
                        `

                        <div
                            class="
                                modal-image-fallback
                                d-flex
                                align-items-center
                                justify-content-center
                                bg-secondary
                                rounded
                            "
                            style="
                                min-height:320px;
                                width:100%;
                            "
                        >

                            <div class="text-center text-light">

                                <i
                                    class="bi bi-image"
                                    style="font-size:70px;"
                                ></i>

                                <p class="mt-3 mb-0">
                                    Product image unavailable
                                </p>

                            </div>

                        </div>

                        `
                    );

                }

            };


        } else {

            modalImage.removeAttribute(
                "src"
            );


            modalImage.style.display =
                "none";


            const imageContainer =
                modalImage.parentElement;


            if (
                imageContainer &&
                !imageContainer.querySelector(
                    ".modal-image-fallback"
                )
            ) {

                imageContainer.insertAdjacentHTML(
                    "beforeend",
                    `

                    <div
                        class="
                            modal-image-fallback
                            d-flex
                            align-items-center
                            justify-content-center
                            bg-secondary
                            rounded
                        "
                        style="
                            min-height:320px;
                            width:100%;
                        "
                    >

                        <div class="text-center text-light">

                            <i
                                class="bi bi-image"
                                style="font-size:70px;"
                            ></i>

                            <p class="mt-3 mb-0">
                                No product image
                            </p>

                        </div>

                    </div>

                    `
                );

            }

        }

    }


    // -------------------------------------------------
    // CATEGORY
    // -------------------------------------------------

    if (modalCategory) {

        modalCategory.textContent =
            product.category ||
            "";

    }


    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    if (modalTitle) {

        modalTitle.textContent =
            product.name ||
            "";

    }


    // -------------------------------------------------
    // PRICE
    // -------------------------------------------------

    if (modalPrice) {

        modalPrice.textContent =
            `₦${Number(
                product.price || 0
            ).toLocaleString()}`;

    }


    // -------------------------------------------------
    // DESCRIPTION
    // -------------------------------------------------

    if (modalDescription) {

        modalDescription.textContent =
            product.description ||
            "";

    }


    // -------------------------------------------------
    // RATING
    // -------------------------------------------------

    if (modalRating) {

        const rating =
            Number(
                product.rating || 0
            );


        modalRating.innerHTML =
            createModalStars(
                rating
            );

    }


    // -------------------------------------------------
    // QUANTITY
    // -------------------------------------------------

    if (modalQty) {

        modalQty.textContent =
            quantity;

    }


    // -------------------------------------------------
    // ADD TO CART
    // -------------------------------------------------

    if (addButton) {

        addButton.onclick = () => {

            if (!currentProduct) {

                return;

            }


            // ---------------------------------------------
            // Add selected quantity
            // ---------------------------------------------

            for (
                let i = 0;
                i < quantity;
                i++
            ) {

                addToCart(
                    currentProduct
                );

            }


            // ---------------------------------------------
            // Update cart UI
            // ---------------------------------------------

            renderCart();


            // ---------------------------------------------
            // Get modal instance
            // ---------------------------------------------

            const modal =
                bootstrap.Modal
                    .getOrCreateInstance(
                        modalElement
                    );


            // ---------------------------------------------
            // Hide product modal
            // ---------------------------------------------

            modal.hide();


            // ---------------------------------------------
            // Open cart after modal closes
            // ---------------------------------------------

            modalElement.addEventListener(
                "hidden.bs.modal",
                () => {

                    const cartElement =
                        document.getElementById(
                            "cart"
                        );


                    if (!cartElement) {

                        return;

                    }


                    const cart =
                        bootstrap.Offcanvas
                            .getOrCreateInstance(
                                cartElement
                            );


                    cart.show();

                },
                {
                    once: true
                }
            );

        };

    }


    // -------------------------------------------------
    // SHOW MODAL
    // -------------------------------------------------

    const modal =
        bootstrap.Modal
            .getOrCreateInstance(
                modalElement
            );


    modal.show();

}


// =====================================================
// MODAL STAR RATING
// =====================================================

function createModalStars(
    rating
) {

    const numericRating =
        Math.max(
            0,
            Math.min(
                5,
                Number(rating) || 0
            )
        );


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= numericRating
        ) {

            stars += `

                <i
                    class="bi bi-star-fill text-warning me-1"
                ></i>

            `;

        } else {

            stars += `

                <i
                    class="bi bi-star text-warning me-1"
                ></i>

            `;

        }

    }


    return stars;

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "#qtyPlus"
            );


        if (!button) {

            return;

        }


        quantity++;


        const modalQty =
            document.getElementById(
                "modalQty"
            );


        if (modalQty) {

            modalQty.textContent =
                quantity;

        }

    }
);


// =====================================================
// DECREASE QUANTITY
// =====================================================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                "#qtyMinus"
            );


        if (!button) {

            return;

        }


        if (
            quantity > 1
        ) {

            quantity--;

        }


        const modalQty =
            document.getElementById(
                "modalQty"
            );


        if (modalQty) {

            modalQty.textContent =
                quantity;

        }

    }
);
