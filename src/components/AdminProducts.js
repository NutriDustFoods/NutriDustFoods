import axios from "axios";
import * as bootstrap from "bootstrap";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =====================================================
// AUTH TOKEN
// =====================================================

API.interceptors.request.use((config) => {

    const token =
        localStorage.getItem("nutridust-admin-token");

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    return config;

});


// =====================================================
// ADMIN PRODUCTS HTML
// =====================================================

export function AdminProducts() {

    return `

        <div class="container-fluid py-4 px-lg-5">

            <div class="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 class="fw-bold mb-1">

                        <i class="bi bi-box-seam me-2"></i>

                        Products

                    </h2>

                    <p class="text-muted mb-0">

                        Manage NutriDust Foods products

                    </p>

                </div>


                <button
                    class="btn btn-dark"
                    id="addProductButton"
                >

                    <i class="bi bi-plus-lg me-2"></i>

                    Add Product

                </button>

            </div>


            <!-- ================================================= -->
            <!-- PRODUCTS TABLE -->
            <!-- ================================================= -->

            <div class="card border-0 shadow-sm">

                <div class="card-body">

                    <div class="table-responsive">

                        <table class="table table-hover align-middle">

                            <thead>

                                <tr>

                                    <th>Image</th>

                                    <th>Product</th>

                                    <th>Category</th>

                                    <th>Price</th>

                                    <th>Rating</th>

                                    <th>Badge</th>

                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody id="adminProductsTableBody">

                                <tr>

                                    <td
                                        colspan="7"
                                        class="text-center py-5"
                                    >

                                        Loading products...

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>


        <!-- ================================================= -->
        <!-- PRODUCT MODAL -->
        <!-- ================================================= -->

        <div
            class="modal fade"
            id="adminProductModal"
            tabindex="-1"
        >

            <div class="modal-dialog modal-lg modal-dialog-centered">

                <div class="modal-content">


                    <!-- HEADER -->

                    <div class="modal-header">

                        <h5
                            class="modal-title fw-bold"
                            id="productModalTitle"
                        >

                            Add Product

                        </h5>


                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                        ></button>

                    </div>


                    <!-- BODY -->

                    <div class="modal-body">

                        <form id="adminProductForm">

                            <input
                                type="hidden"
                                id="productId"
                            >


                            <div class="row g-3">


                                <!-- PRODUCT NAME -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Product Name

                                    </label>


                                    <input
                                        type="text"
                                        id="productName"
                                        class="form-control"
                                        required
                                    >

                                </div>


                                <!-- CATEGORY -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Category

                                    </label>


                                    <input
                                        type="text"
                                        id="productCategory"
                                        class="form-control"
                                        required
                                    >

                                </div>


                                <!-- DESCRIPTION -->

                                <div class="col-12">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Description

                                    </label>


                                    <textarea
                                        id="productDescription"
                                        class="form-control"
                                        rows="4"
                                    ></textarea>

                                </div>


                                <!-- PRODUCT IMAGE -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Product Image

                                    </label>


                                    <input
                                        type="file"
                                        id="productImage"
                                        class="form-control"
                                        accept="image/*"
                                    >


                                    <div
                                        id="productImagePreview"
                                        class="mt-2"
                                    ></div>

                                </div>


                                <!-- PRICE -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Price (₦)

                                    </label>


                                    <input
                                        type="number"
                                        id="productPrice"
                                        class="form-control"
                                        min="0"
                                        required
                                    >

                                </div>


                                <!-- RATING -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Rating

                                    </label>


                                    <input
                                        type="number"
                                        id="productRating"
                                        class="form-control"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value="5"
                                    >

                                </div>


                                <!-- BADGE -->

                                <div class="col-md-6">

                                    <label
                                        class="form-label fw-semibold"
                                    >

                                        Badge

                                    </label>


                                    <input
                                        type="text"
                                        id="productBadge"
                                        class="form-control"
                                        placeholder="NEW"
                                    >

                                </div>


                            </div>


                            <!-- BUTTONS -->

                            <div
                                class="d-flex justify-content-end gap-2 mt-4"
                            >

                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    class="btn btn-dark"
                                    id="saveProductButton"
                                >

                                    Save Product

                                </button>

                            </div>


                        </form>

                    </div>

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// LOAD PRODUCTS
// =====================================================

export async function loadAdminProducts() {

    const tbody =
        document.getElementById(
            "adminProductsTableBody"
        );


    if (!tbody) return;


    try {

        const response =
            await API.get(
                "/admin/products"
            );


        const data =
            response.data;


        const products =
            data.products ||
            data ||
            [];


        if (!Array.isArray(products)) {

            throw new Error(
                "Invalid products response."
            );

        }


        if (!products.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-muted py-5"
                    >

                        No products found.

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            products.map(product => {

                const imageUrl =
                    product.image
                        ? (
                            product.image.startsWith("http")
                                ? product.image
                                : `http://localhost:5000${product.image}`
                        )
                        : "";


                return `

                    <tr>


                        <!-- IMAGE -->

                        <td>

                            ${
                                imageUrl
                                    ? `

                                        <img
                                            src="${escapeHtml(imageUrl)}"
                                            alt="${escapeHtml(product.name)}"
                                            style="
                                                width:60px;
                                                height:60px;
                                                object-fit:cover;
                                                border-radius:8px;
                                            "
                                            onerror="this.style.display='none';"
                                        >

                                    `
                                    : `

                                        <div
                                            class="bg-light rounded d-flex align-items-center justify-content-center"
                                            style="
                                                width:60px;
                                                height:60px;
                                            "
                                        >

                                            <i
                                                class="bi bi-image text-muted"
                                            ></i>

                                        </div>

                                    `
                            }

                        </td>


                        <!-- PRODUCT -->

                        <td>

                            <strong>

                                ${escapeHtml(
                                    product.name
                                )}

                            </strong>


                            <small class="d-block text-muted">

                                #${product.id}

                            </small>

                        </td>


                        <!-- CATEGORY -->

                        <td>

                            ${escapeHtml(
                                product.category
                            )}

                        </td>


                        <!-- PRICE -->

                        <td>

                            <strong>

                                ₦${Number(
                                    product.price || 0
                                ).toLocaleString()}

                            </strong>

                        </td>


                        <!-- RATING -->

                        <td>

                            ⭐ ${
                                Number(
                                    product.rating || 0
                                ).toFixed(1)
                            }

                        </td>


                        <!-- BADGE -->

                        <td>

                            <span class="badge bg-dark">

                                ${escapeHtml(
                                    product.badge || "NEW"
                                )}

                            </span>

                        </td>


                        <!-- ACTION -->

                        <td>

                            <button
                                class="btn btn-sm btn-outline-dark edit-product"
                                data-id="${product.id}"
                            >

                                <i class="bi bi-pencil me-1"></i>

                                Edit

                            </button>


                            <button
                                class="btn btn-sm btn-outline-danger delete-product"
                                data-id="${product.id}"
                            >

                                <i class="bi bi-trash me-1"></i>

                                Delete

                            </button>

                        </td>


                    </tr>

                `;

            }).join("");


        attachProductButtons(products);


    } catch (error) {

        console.error(
            "❌ Product loading error:",
            error
        );


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-danger py-5"
                >

                    Unable to load products.

                    <br>

                    <small>

                        ${escapeHtml(
                            error.message
                        )}

                    </small>

                </td>

            </tr>

        `;

    }

}


// =====================================================
// PRODUCT BUTTONS
// =====================================================

function attachProductButtons(products) {


    document
        .querySelectorAll(".edit-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const product =
                        products.find(
                            item =>
                                String(item.id) ===
                                String(button.dataset.id)
                        );


                    if (product) {

                        openProductModal(
                            product
                        );

                    }

                }
            );

        });


    document
        .querySelectorAll(".delete-product")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteProduct(
                        button.dataset.id
                    );

                }
            );

        });

}


// =====================================================
// OPEN ADD PRODUCT
// =====================================================

function openAddProduct() {

    document
        .getElementById(
            "adminProductForm"
        )
        ?.reset();


    document
        .getElementById(
            "productId"
        )
        .value = "";


    document
        .getElementById(
            "productRating"
        )
        .value = "5";


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
            "Add Product";


    document
        .getElementById(
            "productImagePreview"
        ).innerHTML = "";


    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById(
                "adminProductModal"
            )
        )
        .show();

}


// =====================================================
// OPEN EDIT PRODUCT
// =====================================================

function openProductModal(product) {

    document
        .getElementById(
            "productId"
        )
        .value =
            product.id || "";


    document
        .getElementById(
            "productName"
        )
        .value =
            product.name || "";


    document
        .getElementById(
            "productCategory"
        )
        .value =
            product.category || "";


    document
        .getElementById(
            "productDescription"
        )
        .value =
            product.description || "";


    // IMPORTANT:
    // File inputs cannot be populated with an existing
    // server filename for security reasons.

    document
        .getElementById(
            "productImage"
        )
        .value = "";


    // Existing image preview

    const preview =
        document.getElementById(
            "productImagePreview"
        );


    if (
        preview &&
        product.image
    ) {

        const imageUrl =
            product.image.startsWith("http")
                ? product.image
                : `http://localhost:5000${product.image}`;


        preview.innerHTML = `

            <div class="mt-2">

                <small class="text-muted d-block mb-1">

                    Current image

                </small>

                <img
                    src="${escapeHtml(imageUrl)}"
                    alt="Current product image"
                    style="
                        width:100px;
                        height:100px;
                        object-fit:cover;
                        border-radius:8px;
                        border:1px solid #ddd;
                    "
                >

            </div>

        `;

    } else if (preview) {

        preview.innerHTML = "";

    }


    document
        .getElementById(
            "productPrice"
        )
        .value =
            product.price || "";


    document
        .getElementById(
            "productRating"
        )
        .value =
            product.rating ?? 5;


    document
        .getElementById(
            "productBadge"
        )
        .value =
            product.badge || "NEW";


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
            "Edit Product";


    bootstrap.Modal
        .getOrCreateInstance(
            document.getElementById(
                "adminProductModal"
            )
        )
        .show();

}


// =====================================================
// SAVE PRODUCT
// =====================================================

async function saveProduct(event) {

    event.preventDefault();


    const id =
        document
            .getElementById(
                "productId"
            )
            .value;


    const fileInput =
        document
            .getElementById(
                "productImage"
            );


    const formData =
        new FormData();


    formData.append(
        "name",
        document
            .getElementById(
                "productName"
            )
            .value
            .trim()
    );


    formData.append(
        "category",
        document
            .getElementById(
                "productCategory"
            )
            .value
            .trim()
    );


    formData.append(
        "description",
        document
            .getElementById(
                "productDescription"
            )
            .value
            .trim()
    );


    formData.append(
        "price",
        document
            .getElementById(
                "productPrice"
            )
            .value
    );


    formData.append(
        "rating",
        document
            .getElementById(
                "productRating"
            )
            .value
    );


    formData.append(
        "badge",
        document
            .getElementById(
                "productBadge"
            )
            .value
            .trim()
    );


    // =================================================
    // IMAGE
    // =================================================

    if (
        fileInput &&
        fileInput.files &&
        fileInput.files.length > 0
    ) {

        formData.append(
            "image",
            fileInput.files[0]
        );

    }


    const button =
        document
            .getElementById(
                "saveProductButton"
            );


    try {

        button.disabled = true;

        button.textContent =
            "Saving...";


        // =================================================
        // CREATE
        // =================================================

        if (!id) {

            await API.post(
                "/admin/products",
                formData
            );

        }


        // =================================================
        // UPDATE
        // =================================================

        else {

            await API.put(
                `/admin/products/${id}`,
                formData
            );

        }


        await loadAdminProducts();


        bootstrap.Modal
            .getOrCreateInstance(
                document.getElementById(
                    "adminProductModal"
                )
            )
            .hide();


        alert(
            id
                ? "Product updated successfully."
                : "Product added successfully."
        );


    } catch (error) {

        console.error(
            "❌ Save product error:",
            error
        );


        const message =
            error?.response?.data?.message ||
            error.message ||
            "Unknown error";


        alert(
            "Unable to save product.\n\n" +
            message
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Save Product";

    }

}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(id) {

    if (
        !confirm(
            `Delete product #${id}?`
        )
    ) {

        return;

    }


    try {

        await API.delete(
            `/admin/products/${id}`
        );


        await loadAdminProducts();


        alert(
            "Product deleted successfully."
        );


    } catch (error) {

        console.error(
            "❌ Delete product error:",
            error
        );


        const message =
            error?.response?.data?.message ||
            error.message ||
            "Unknown error";


        alert(
            "Unable to delete product.\n\n" +
            message
        );

    }

}


// =====================================================
// IMAGE PREVIEW
// =====================================================

function setupImagePreview() {

    const input =
        document.getElementById(
            "productImage"
        );


    const preview =
        document.getElementById(
            "productImagePreview"
        );


    if (
        !input ||
        !preview
    ) {

        return;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];


            if (!file) {

                preview.innerHTML = "";

                return;

            }


            const imageUrl =
                URL.createObjectURL(
                    file
                );


            preview.innerHTML = `

                <div class="mt-2">

                    <small class="text-muted d-block mb-1">

                        Selected image

                    </small>

                    <img
                        src="${imageUrl}"
                        alt="Selected product image"
                        style="
                            width:100px;
                            height:100px;
                            object-fit:cover;
                            border-radius:8px;
                            border:1px solid #ddd;
                        "
                    >

                </div>

            `;

        }
    );

}


// =====================================================
// SETUP
// =====================================================

export function setupAdminProducts() {

    document
        .getElementById(
            "addProductButton"
        )
        ?.addEventListener(
            "click",
            openAddProduct
        );


    document
        .getElementById(
            "adminProductForm"
        )
        ?.addEventListener(
            "submit",
            saveProduct
        );


    setupImagePreview();


    loadAdminProducts();

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