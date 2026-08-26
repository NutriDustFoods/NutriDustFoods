import axios from "axios";
import * as bootstrap from "bootstrap";


// =====================================================
// API
// =====================================================

const API = axios.create({
    baseURL: __API_URL__
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
// INVENTORY CACHE
// =====================================================

let inventoryData = [];


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

                        Products & Inventory

                    </h2>

                    <p class="text-muted mb-0">

                        Manage NutriDust Foods products and stock

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

                                    <th>Produced</th>

                                    <th>Sold</th>

                                    <th>Available</th>

                                    <th>Status</th>

                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody id="adminProductsTableBody">

                                <tr>

                                    <td
                                        colspan="9"
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


                    <div class="modal-body">

                        <form id="adminProductForm">

                            <input
                                type="hidden"
                                id="productId"
                            >


                            <div class="row g-3">


                                <!-- PRODUCT NAME -->

                                <div class="col-md-6">

                                    <label class="form-label fw-semibold">

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

                                    <label class="form-label fw-semibold">

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

                                    <label class="form-label fw-semibold">

                                        Description

                                    </label>

                                    <textarea
                                        id="productDescription"
                                        class="form-control"
                                        rows="4"
                                    ></textarea>

                                </div>


                                <!-- IMAGE -->

                                <div class="col-md-6">

                                    <label class="form-label fw-semibold">

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

                                    <label class="form-label fw-semibold">

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

                                    <label class="form-label fw-semibold">

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

                                    <label class="form-label fw-semibold">

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


        <!-- ================================================= -->
        <!-- INVENTORY MANAGEMENT MODAL -->
        <!-- ================================================= -->

        <div
            class="modal fade"
            id="inventoryModal"
            tabindex="-1"
        >

            <div class="modal-dialog modal-lg modal-dialog-centered">

                <div class="modal-content">


                    <div class="modal-header bg-dark text-white">

                        <div>

                            <h5
                                class="modal-title fw-bold"
                                id="inventoryModalTitle"
                            >

                                Manage Inventory

                            </h5>

                            <small
                                id="inventoryModalSubtitle"
                                class="text-secondary"
                            ></small>

                        </div>


                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                        ></button>

                    </div>


                    <div class="modal-body">


                        <!-- INVENTORY SUMMARY -->

                        <div
                            id="inventorySummary"
                            class="row g-3 mb-4"
                        ></div>


                        <!-- ADD PRODUCTION -->

                        <div class="card border-success mb-4">

                            <div class="card-body">

                                <h5 class="fw-bold text-success">

                                    <i class="bi bi-plus-circle me-2"></i>

                                    Add Processed Products

                                </h5>

                                <p class="text-muted">

                                    Enter the number of new units produced
                                    and added to stock.

                                </p>


                                <div class="row g-3">

                                    <div class="col-md-6">

                                        <label
                                            class="form-label fw-semibold"
                                        >

                                            Quantity Produced

                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            id="productionQuantity"
                                            class="form-control"
                                            placeholder="e.g. 100"
                                        >

                                    </div>


                                    <div class="col-md-6">

                                        <label
                                            class="form-label fw-semibold"
                                        >

                                            Note

                                        </label>

                                        <input
                                            type="text"
                                            id="productionNote"
                                            class="form-control"
                                            placeholder="e.g. Production batch #001"
                                        >

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    class="btn btn-success mt-3"
                                    id="addProductionButton"
                                >

                                    <i class="bi bi-plus-circle me-2"></i>

                                    Add Production

                                </button>

                            </div>

                        </div>


                        <!-- MANUAL ADJUSTMENT -->

                        <div class="card border-warning mb-4">

                            <div class="card-body">

                                <h5 class="fw-bold text-warning">

                                    <i class="bi bi-sliders me-2"></i>

                                    Manual Stock Adjustment

                                </h5>

                                <p class="text-muted">

                                    Use a positive number to add stock or a
                                    negative number to remove stock.

                                </p>


                                <div class="row g-3">

                                    <div class="col-md-6">

                                        <label
                                            class="form-label fw-semibold"
                                        >

                                            Adjustment

                                        </label>

                                        <input
                                            type="number"
                                            id="adjustmentQuantity"
                                            class="form-control"
                                            placeholder="e.g. -5 or 20"
                                        >

                                    </div>


                                    <div class="col-md-6">

                                        <label
                                            class="form-label fw-semibold"
                                        >

                                            Reason

                                        </label>

                                        <input
                                            type="text"
                                            id="adjustmentNote"
                                            class="form-control"
                                            placeholder="Damaged, missing, correction..."
                                        >

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    class="btn btn-warning mt-3"
                                    id="adjustInventoryButton"
                                >

                                    <i class="bi bi-sliders me-2"></i>

                                    Adjust Stock

                                </button>

                            </div>

                        </div>


                        <!-- HISTORY -->

                        <div class="card border-0 bg-light">

                            <div class="card-body">

                                <div
                                    class="d-flex justify-content-between align-items-center mb-3"
                                >

                                    <h5 class="fw-bold mb-0">

                                        <i class="bi bi-clock-history me-2"></i>

                                        Inventory History

                                    </h5>


                                    <div class="btn-group" role="group" aria-label="Inventory history actions">
                                    <button type="button" class="btn btn-sm btn-outline-success" id="exportInventoryExcelButton" title="Export Excel">
                                        <i class="bi bi-file-earmark-spreadsheet me-1"></i> Excel
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-danger" id="exportInventoryPdfButton" title="Export PDF">
                                        <i class="bi bi-file-earmark-pdf me-1"></i> PDF
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-dark"
                                        id="refreshInventoryHistoryButton"
                                    >

                                        <i class="bi bi-arrow-clockwise"></i>

                                    </button>
                                    </div>

                                </div>


                                <div
                                    id="inventoryHistory"
                                    class="table-responsive"
                                >

                                    Loading history...

                                </div>

                            </div>

                        </div>

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

        const [
            productsResponse,
            inventoryResponse
        ] = await Promise.all([

            API.get("/admin/products"),

            API.get("/admin/inventory")

        ]);


        const productsData =
            productsResponse.data;

        const inventoryResult =
            inventoryResponse.data;


        const products =
            productsData.products ||
            productsData ||
            [];


        inventoryData =
            inventoryResult.inventory ||
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
                        colspan="9"
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

                const inventory =
                    inventoryData.find(
                        item =>
                            String(item.productId) ===
                            String(product.id)
                    );


                const produced =
                    Number(
                        inventory?.totalProduced || 0
                    );


                const sold =
                    Number(
                        inventory?.totalSold || 0
                    );


                const available =
                    Number(
                        inventory?.quantityAvailable || 0
                    );


                const threshold =
                    Number(
                        inventory?.lowStockThreshold || 10
                    );


                let statusHtml;


                if (available <= 0) {

                    statusHtml = `

                        <span class="badge bg-danger">

                            <i class="bi bi-x-circle me-1"></i>

                            Out of Stock

                        </span>

                    `;

                } else if (available <= threshold) {

                    statusHtml = `

                        <span class="badge bg-warning text-dark">

                            <i class="bi bi-exclamation-triangle me-1"></i>

                            Low Stock

                        </span>

                    `;

                } else {

                    statusHtml = `

                        <span class="badge bg-success">

                            <i class="bi bi-check-circle me-1"></i>

                            In Stock

                        </span>

                    `;

                }


                const imageUrl =
                    product.image
                        ? (
                            product.image.startsWith("http")
                                ? product.image
                                : `${__API_ORIGIN__}${product.image}`
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

                                            <i class="bi bi-image text-muted"></i>

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


                        <!-- PRODUCED -->

                        <td>

                            <span class="fw-bold text-primary">

                                ${produced.toLocaleString()}

                            </span>

                        </td>


                        <!-- SOLD -->

                        <td>

                            <span class="fw-bold text-danger">

                                ${sold.toLocaleString()}

                            </span>

                        </td>


                        <!-- AVAILABLE -->

                        <td>

                            <span
                                class="
                                    fw-bold
                                    ${
                                        available <= 0
                                            ? "text-danger"
                                            : available <= threshold
                                                ? "text-warning"
                                                : "text-success"
                                    }
                                "
                            >

                                ${available.toLocaleString()}

                            </span>

                        </td>


                        <!-- STATUS -->

                        <td>

                            ${statusHtml}

                        </td>


                        <!-- ACTION -->

                        <td>

                            <div class="d-flex gap-1 flex-wrap">

                                <button
                                    class="btn btn-sm btn-success manage-inventory"
                                    data-id="${product.id}"
                                >

                                    <i class="bi bi-boxes me-1"></i>

                                    Stock

                                </button>


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

                            </div>

                        </td>


                    </tr>

                `;

            }).join("");


        attachProductButtons(products);


    } catch (error) {

        console.error(
            "❌ Product/inventory loading error:",
            error
        );


        tbody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center text-danger py-5"
                >

                    Unable to load products and inventory.

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

    if (!window.nutridustAdminCan?.("products.manage")) {
        document.querySelectorAll(".edit-product, .delete-product").forEach(button => button.remove());
    }

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


    document
        .querySelectorAll(".manage-inventory")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openInventoryModal(
                        button.dataset.id
                    );

                }
            );

        });

}


// =====================================================
// OPEN INVENTORY MODAL
// =====================================================

async function openInventoryModal(productId) {

    const inventory =
        inventoryData.find(
            item =>
                String(item.productId) ===
                String(productId)
        );


    if (!inventory) {

        alert(
            "Inventory record not found."
        );

        return;

    }


    document
        .getElementById(
            "inventoryModalTitle"
        )
        .textContent =
            "Manage Inventory";


    document
        .getElementById(
            "inventoryModalSubtitle"
        )
        .textContent =
            inventory.name;


    const summary =
        document.getElementById(
            "inventorySummary"
        );


    summary.innerHTML = `

        <div class="col-md-4">

            <div class="card bg-primary text-white border-0">

                <div class="card-body">

                    <small>Total Produced</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(
                            inventory.totalProduced || 0
                        ).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="card bg-danger text-white border-0">

                <div class="card-body">

                    <small>Total Sold</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(
                            inventory.totalSold || 0
                        ).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="card bg-success text-white border-0">

                <div class="card-body">

                    <small>Available</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(
                            inventory.quantityAvailable || 0
                        ).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>

    `;


    // -------------------------------------------------
    // CLEAR INPUTS
    // -------------------------------------------------

    document
        .getElementById(
            "productionQuantity"
        )
        .value = "";


    document
        .getElementById(
            "productionNote"
        )
        .value = "";


    document
        .getElementById(
            "adjustmentQuantity"
        )
        .value = "";


    document
        .getElementById(
            "adjustmentNote"
        )
        .value = "";


    // -------------------------------------------------
    // STORE PRODUCT ID
    // -------------------------------------------------

    const modal =
        document.getElementById(
            "inventoryModal"
        );


    modal.dataset.productId =
        productId;


    await loadInventoryHistory(
        productId
    );


    bootstrap.Modal
        .getOrCreateInstance(
            modal
        )
        .show();

}


// =====================================================
// ADD PRODUCTION
// =====================================================

async function addProduction() {

    const modal =
        document.getElementById(
            "inventoryModal"
        );


    const productId =
        modal?.dataset?.productId;


    const quantity =
        Number(
            document.getElementById(
                "productionQuantity"
            )?.value
        );


    const note =
        document.getElementById(
            "productionNote"
        )?.value?.trim() || "";


    if (!productId) {

        alert(
            "Product not selected."
        );

        return;

    }


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Enter a valid production quantity."
        );

        return;

    }


    const button =
        document.getElementById(
            "addProductionButton"
        );


    try {

        button.disabled = true;

        button.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Adding...

        `;


        await API.post(
            `/admin/inventory/${productId}/production`,
            {
                quantity,
                note
            }
        );


        alert(
            "Production quantity added successfully."
        );


        await loadAdminProducts();


        await openInventoryModal(
            productId
        );


    } catch (error) {

        console.error(
            "❌ Add production error:",
            error
        );


        alert(
            "Unable to add production.\n\n" +
            (
                error?.response?.data?.message ||
                error.message ||
                "Unknown error"
            )
        );

    } finally {

        button.disabled = false;

        button.innerHTML = `

            <i class="bi bi-plus-circle me-2"></i>

            Add Production

        `;

    }

}


// =====================================================
// ADJUST INVENTORY
// =====================================================

async function adjustStock() {

    const modal =
        document.getElementById(
            "inventoryModal"
        );


    const productId =
        modal?.dataset?.productId;


    const quantity =
        Number(
            document.getElementById(
                "adjustmentQuantity"
            )?.value
        );


    const note =
        document.getElementById(
            "adjustmentNote"
        )?.value?.trim() || "";


    if (!productId) {

        alert(
            "Product not selected."
        );

        return;

    }


    if (
        !Number.isInteger(quantity) ||
        quantity === 0
    ) {

        alert(
            "Enter a valid adjustment quantity."
        );

        return;

    }


    if (!note) {

        alert(
            "Please enter a reason for the adjustment."
        );

        return;

    }


    const button =
        document.getElementById(
            "adjustInventoryButton"
        );


    try {

        button.disabled = true;

        button.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Adjusting...

        `;


        await API.patch(
            `/admin/inventory/${productId}/adjust`,
            {
                quantity,
                note
            }
        );


        alert(
            "Inventory adjusted successfully."
        );


        await loadAdminProducts();


        await openInventoryModal(
            productId
        );


    } catch (error) {

        console.error(
            "❌ Inventory adjustment error:",
            error
        );


        alert(
            "Unable to adjust inventory.\n\n" +
            (
                error?.response?.data?.message ||
                error.message ||
                "Unknown error"
            )
        );

    } finally {

        button.disabled = false;

        button.innerHTML = `

            <i class="bi bi-sliders me-2"></i>

            Adjust Stock

        `;

    }

}


// =====================================================
// LOAD INVENTORY HISTORY
// =====================================================

async function loadInventoryHistory(productId) {

    const history =
        document.getElementById(
            "inventoryHistory"
        );


    if (!history) return;


    history.innerHTML = `

        <div class="text-center py-3">

            <span
                class="spinner-border spinner-border-sm"
            ></span>

            Loading history...

        </div>

    `;


    try {

        const response =
            await API.get(
                `/admin/inventory/${productId}/history`
            );


        const data =
            response.data;


        const movements =
            Array.isArray(data.movements)
                ? data.movements
                : [];


        if (!movements.length) {

            history.innerHTML = `

                <div class="text-center text-muted py-4">

                    <i class="bi bi-clock-history display-6"></i>

                    <p class="mt-2 mb-0">

                        No inventory movements yet.

                    </p>

                </div>

            `;

            return;

        }


        history.innerHTML = `

            <table class="table table-sm align-middle">

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Type</th>

                        <th>Quantity</th>

                        <th>Note</th>

                        <th>Performed By</th>

                    </tr>

                </thead>

                <tbody>

                    ${movements.map(
                        movement => {

                            const quantity =
                                Number(
                                    movement.quantity
                                );


                            const positive =
                                quantity > 0;


                            const movementType =
                                String(
                                    movement.movementType ||
                                    ""
                                ).toLowerCase();


                            // -------------------------------------------------
                            // TYPE BADGE
                            // -------------------------------------------------

                            let badgeClass =
                                "bg-secondary";


                            let typeIcon =
                                "bi-arrow-left-right";


                            if (
                                movementType ===
                                "production"
                            ) {

                                badgeClass =
                                    "bg-success";

                                typeIcon =
                                    "bi-box-seam";

                            } else if (
                                movementType ===
                                "sale"
                            ) {

                                badgeClass =
                                    "bg-danger";

                                typeIcon =
                                    "bi-cart-check";

                            } else if (
                                movementType ===
                                "reservation"
                            ) {

                                badgeClass =
                                    "bg-warning text-dark";

                                typeIcon =
                                    "bi-clock";

                            } else if (
                                movementType ===
                                "adjustment"
                            ) {

                                badgeClass =
                                    "bg-warning text-dark";

                                typeIcon =
                                    "bi-sliders";

                            }


                            // -------------------------------------------------
                            // PERFORMED BY
                            // -------------------------------------------------

                            const performedBy =
                                movement.performedBy ||
                                movement.performed_by ||
                                "SYSTEM";


                            // -------------------------------------------------
                            // NOTE
                            // -------------------------------------------------

                            const note =
                                movement.note ||
                                "";


                            return `

                                <tr>

                                    <!-- DATE -->

                                    <td>

                                        ${formatDate(
                                            movement.createdAt
                                        )}

                                    </td>


                                    <!-- TYPE -->

                                    <td>

                                        <span
                                            class="badge ${badgeClass}"
                                        >

                                            <i
                                                class="bi ${typeIcon} me-1"
                                            ></i>

                                            ${escapeHtml(
                                                movementType ||
                                                "unknown"
                                            )}

                                        </span>

                                    </td>


                                    <!-- QUANTITY -->

                                    <td>

                                        <strong
                                            class="${
                                                positive
                                                    ? "text-success"
                                                    : "text-danger"
                                            }"
                                        >

                                            ${
                                                positive
                                                    ? "+"
                                                    : ""
                                            }${quantity}

                                        </strong>

                                    </td>


                                    <!-- NOTE -->

                                    <td>

                                        ${escapeHtml(
                                            note
                                        )}

                                    </td>


                                    <!-- PERFORMED BY -->

                                    <td>

                                        <span
                                            class="fw-semibold"
                                        >

                                            <i
                                                class="bi bi-person-circle me-1"
                                            ></i>

                                            ${escapeHtml(
                                                performedBy
                                            )}

                                        </span>

                                    </td>

                                </tr>

                            `;

                        }
                    ).join("")}

                </tbody>

            </table>

        `;


    } catch (error) {

        console.error(
            "❌ Inventory history error:",
            error
        );


        history.innerHTML = `

            <div class="alert alert-danger">

                Unable to load inventory history.

                <br>

                <small>

                    ${escapeHtml(
                        error?.response?.data?.message ||
                        error.message ||
                        "Unknown error"
                    )}

                </small>

            </div>

        `;

    }

}


async function downloadInventoryReport(format) {
    const productId = document.getElementById("inventoryModal")?.dataset?.productId;
    if (!productId || !["excel", "pdf"].includes(format)) return;
    const button = document.getElementById(format === "excel" ? "exportInventoryExcelButton" : "exportInventoryPdfButton");
    const original = button?.innerHTML;
    if (button) { button.disabled = true; button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }
    try {
        const response = await API.get(`/admin/inventory/reports/${format}`, { params:{ productId }, responseType:"blob" });
        const extension = format === "excel" ? "xlsx" : "pdf";
        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = `nutridust-inventory-product-${productId}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        alert("Unable to export the inventory report. Please try again.");
    } finally {
        if (button) { button.disabled = false; button.innerHTML = original; }
    }
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
        )
        .innerHTML = "";


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


    document
        .getElementById(
            "productImage"
        )
        .value = "";


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
                : `${__API_ORIGIN__}${product.image}`;


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


        if (!id) {

            await API.post(
                "/admin/products",
                formData
            );

        } else {

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

    if (!window.nutridustAdminCan?.("products.manage")) {
        document.getElementById("addProductButton")?.remove();
    }
    if (!window.nutridustAdminCan?.("inventory.manage")) {
        document.getElementById("addProductionButton")?.remove();
        document.getElementById("adjustInventoryButton")?.remove();
    }

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


    document
        .getElementById(
            "addProductionButton"
        )
        ?.addEventListener(
            "click",
            addProduction
        );


    document
        .getElementById(
            "adjustInventoryButton"
        )
        ?.addEventListener(
            "click",
            adjustStock
        );


    document
        .getElementById(
            "refreshInventoryHistoryButton"
        )
        ?.addEventListener(
            "click",
            async () => {

                const productId =
                    document
                        .getElementById(
                            "inventoryModal"
                        )
                        ?.dataset
                        ?.productId;


                if (productId) {

                    await loadInventoryHistory(
                        productId
                    );

                }

            }
        );

    document.getElementById("exportInventoryExcelButton")?.addEventListener("click", () => downloadInventoryReport("excel"));
    document.getElementById("exportInventoryPdfButton")?.addEventListener("click", () => downloadInventoryReport("pdf"));


    setupImagePreview();


    loadAdminProducts();

}


// =====================================================
// FORMAT DATE
// =====================================================
// IMPORTANT:
// We are deliberately NOT changing the timestamp logic.
// Your current timestamp is now displaying correctly.
// The browser will format the backend timestamp in the
// user's local timezone.
// =====================================================

function formatDate(value) {

    if (!value) {

        return "—";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return escapeHtml(
            value
        );

    }


    return date.toLocaleString();

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
