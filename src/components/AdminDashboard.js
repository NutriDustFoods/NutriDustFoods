import * as bootstrap from "bootstrap";
import axios from "axios";

import {
    logoutAdmin
} from "./AdminLogin.js";

import {
    formatDateTime
} from "../utils/dateTime.js";


// =====================================================
// API
// =====================================================

const API = axios.create({

    baseURL: __API_URL__

});


// =====================================================
// ADMIN JWT
// =====================================================

API.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "nutridust-admin-token"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// =====================================================
// ADMIN DASHBOARD HTML
// =====================================================

export function AdminDashboard() {

    return `

        <div class="container-fluid py-4 px-lg-5">

            <!-- HEADER -->

            <div class="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 class="fw-bold mb-1">

                        <i class="bi bi-speedometer2 me-2"></i>

                        NutriDust Admin

                    </h1>

                    <p class="text-muted mb-0">

                        Order Management Dashboard

                    </p>

                </div>


                <div class="d-flex align-items-center gap-2">

                    <div class="text-end me-2">

                        <small class="text-muted d-block">
                            Logged in as
                        </small>

                        <strong>
                            Admin
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="btn btn-dark"
                        id="refreshOrdersButton"
                    >

                        <i class="bi bi-arrow-clockwise me-2"></i>

                        Refresh

                    </button>


                    <button
                        type="button"
                        class="btn btn-outline-danger"
                        id="adminLogoutButton"
                    >

                        <i class="bi bi-box-arrow-right me-2"></i>

                        Logout

                    </button>

                </div>

            </div>


            <!-- STATISTICS -->

            <div class="row g-3 mb-4">

                <div class="col-sm-6 col-xl-3">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body">

                            <small class="text-muted">
                                Total Orders
                            </small>

                            <h2
                                class="fw-bold mt-2 mb-0"
                                id="totalOrders"
                            >
                                0
                            </h2>

                        </div>

                    </div>

                </div>


                <div class="col-sm-6 col-xl-3">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body">

                            <small class="text-muted">
                                Total Sales
                            </small>

                            <h2
                                class="fw-bold mt-2 mb-0"
                                id="totalSales"
                            >
                                ₦0
                            </h2>

                        </div>

                    </div>

                </div>


                <div class="col-sm-6 col-xl-3">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body">

                            <small class="text-muted">
                                Paid Orders
                            </small>

                            <h2
                                class="fw-bold mt-2 mb-0 text-success"
                                id="paidOrders"
                            >
                                0
                            </h2>

                        </div>

                    </div>

                </div>


                <div class="col-sm-6 col-xl-3">

                    <div class="card border-0 shadow-sm h-100">

                        <div class="card-body">

                            <small class="text-muted">
                                Pending Payments
                            </small>

                            <h2
                                class="fw-bold mt-2 mb-0 text-warning"
                                id="pendingOrders"
                            >
                                0
                            </h2>

                        </div>

                    </div>

                </div>

            </div>


            <!-- FILTERS -->

            <div class="card border-0 shadow-sm mb-4">

                <div class="card-body">

                    <div class="row g-3">

                        <div class="col-lg-6">

                            <label class="form-label fw-semibold">
                                Search
                            </label>

                            <input
                                type="search"
                                id="orderSearch"
                                class="form-control"
                                placeholder="Search order, customer or email..."
                            >

                        </div>


                        <div class="col-lg-3">

                            <label class="form-label fw-semibold">
                                Payment
                            </label>

                            <select
                                id="paymentFilter"
                                class="form-select"
                            >

                                <option value="all">
                                    All Payments
                                </option>

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                            </select>

                        </div>


                        <div class="col-lg-3">

                            <label class="form-label fw-semibold">
                                Order Status
                            </label>

                            <select
                                id="statusFilter"
                                class="form-select"
                            >

                                <option value="all">
                                    All Statuses
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="processing">
                                    Processing
                                </option>

                                <option value="out_for_delivery">
                                    On Delivery
                                </option>

                                <option value="delivered">
                                    Delivered
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ORDERS -->

            <div class="card border-0 shadow-sm">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center mb-3">

                        <h4 class="fw-bold mb-0">
                            Orders
                        </h4>

                        <span
                            id="ordersCount"
                            class="badge bg-dark"
                        >
                            0 Orders
                        </span>

                    </div>


                    <div class="table-responsive">

                        <table class="table table-hover align-middle">

                            <thead>

                                <tr>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="ordersTableBody">

                                <tr>

                                    <td
                                        colspan="7"
                                        class="text-center py-5"
                                    >

                                        Loading orders...

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>


        <!-- ORDER DETAILS MODAL -->

        <div
            class="modal fade"
            id="adminOrderModal"
            tabindex="-1"
            aria-hidden="true"
        >

            <div class="modal-dialog modal-lg modal-dialog-centered">

                <div class="modal-content">

                    <div class="modal-header">

                        <h5 class="modal-title fw-bold">
                            Order Details
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                        ></button>

                    </div>


                    <div
                        id="adminOrderDetails"
                        class="modal-body"
                    >

                        Loading...

                    </div>

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// LOAD ORDERS
// =====================================================

export async function loadAdminOrders() {

    try {

        const response =
            await API.get(
                "/admin/orders"
            );


        const data =
            response.data;


        if (
            !data ||
            !data.success
        ) {

            throw new Error(
                data?.message ||
                "Unable to load orders."
            );

        }


        const orders =
            data.orders || [];


        window.nutriDustAdminOrders =
            orders;


        renderStatistics(
            orders
        );


        renderOrders(
            orders
        );


        return orders;

    } catch (error) {

        console.error(
            "❌ Admin order loading error:",
            error
        );


        const table =
            document.getElementById(
                "ordersTableBody"
            );


        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-danger py-5"
                    >

                        <i class="bi bi-exclamation-triangle fs-2"></i>

                        <div class="mt-2">
                            Unable to load orders.
                        </div>

                        <small>
                            ${escapeHtml(
                                error.message
                            )}
                        </small>

                    </td>

                </tr>

            `;

        }


        return [];

    }

}


// =====================================================
// STATISTICS
// =====================================================

function renderStatistics(
    orders
) {

    const totalOrders =
        orders.length;


    const paidOrders =
        orders.filter(
            order =>
                order.paymentStatus ===
                "paid"
        ).length;


    const pendingOrders =
        orders.filter(
            order =>
                order.paymentStatus !==
                "paid"
        ).length;


    const totalSales =
        orders
            .filter(
                order =>
                    order.paymentStatus ===
                    "paid"
            )
            .reduce(
                (
                    total,
                    order
                ) =>
                    total +
                    Number(
                        order.total || 0
                    ),
                0
            );


    const totalOrdersElement =
        document.getElementById(
            "totalOrders"
        );


    const totalSalesElement =
        document.getElementById(
            "totalSales"
        );


    const paidOrdersElement =
        document.getElementById(
            "paidOrders"
        );


    const pendingOrdersElement =
        document.getElementById(
            "pendingOrders"
        );


    if (totalOrdersElement) {

        totalOrdersElement.textContent =
            totalOrders;

    }


    if (totalSalesElement) {

        totalSalesElement.textContent =
            `₦${totalSales.toLocaleString()}`;

    }


    if (paidOrdersElement) {

        paidOrdersElement.textContent =
            paidOrders;

    }


    if (pendingOrdersElement) {

        pendingOrdersElement.textContent =
            pendingOrders;

    }

}


// =====================================================
// RENDER ORDERS
// =====================================================

function renderOrders(
    orders
) {

    const tbody =
        document.getElementById(
            "ordersTableBody"
        );


    const count =
        document.getElementById(
            "ordersCount"
        );


    if (!tbody) {

        return;

    }


    if (count) {

        count.textContent =
            `${orders.length} Order${orders.length === 1 ? "" : "s"}`;

    }


    if (!orders.length) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted py-5"
                >

                    No orders found.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        orders.map(
            order => `

                <tr>

                    <td>
                        <strong>
                            #${escapeHtml(order.id)}
                        </strong>
                    </td>


                    <td>

                        <div class="fw-semibold">
                            ${escapeHtml(
                                order.customerName
                            )}
                        </div>

                        <small class="text-muted">
                            ${escapeHtml(
                                order.customerEmail
                            )}
                        </small>

                    </td>


                    <td>

                        <strong>
                            ₦${Number(
                                order.total || 0
                            ).toLocaleString()}
                        </strong>

                    </td>


                    <td>
                        ${paymentBadge(
                            order.paymentStatus
                        )}
                    </td>


                    <td>
                        ${statusBadge(
                            order.orderStatus
                        )}
                    </td>


                    <td>

    <small>
        ${formatDateTime(
            order.createdAt
        )}
    </small>

</td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-dark view-admin-order"
                            data-order-id="${escapeHtml(order.id)}"
                        >

                            <i class="bi bi-eye me-1"></i>

                            View

                        </button>

                    </td>

                </tr>

            `
        ).join("");


    attachViewButtons();

}


// =====================================================
// PAYMENT BADGE
// =====================================================

function paymentBadge(
    status
) {

    if (
        status === "paid"
    ) {

        return `

            <span class="badge bg-success">
                Paid
            </span>

        `;

    }


    return `

        <span class="badge bg-warning text-dark">
            Pending
        </span>

    `;

}


// =====================================================
// STATUS BADGE
// =====================================================

function statusBadge(
    status
) {

    const normalized =
        String(
            status || "pending"
        ).toLowerCase();


    const classes = {

        pending:
            "bg-warning text-dark",

        processing:
            "bg-primary",

        ready_for_pickup:
            "bg-info text-dark",

        out_for_delivery:
            "bg-info text-dark",

        delivered:
            "bg-success",

        cancelled:
            "bg-danger"

    };


    const labels = {

        pending:
            "Pending",

        processing:
            "Processing",

        ready_for_pickup:
            "Ready for Pickup",

        out_for_delivery:
            "On Delivery",

        delivered:
            "Delivered",

        cancelled:
            "Cancelled"

    };


    return `

        <span class="badge ${
            classes[normalized] ||
            "bg-secondary"
        }">

            ${
                labels[normalized] ||
                normalized
            }

        </span>

    `;

}


// =====================================================
// VIEW BUTTONS
// =====================================================

function attachViewButtons() {

    document
        .querySelectorAll(
            ".view-admin-order"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showOrder(
                            button.dataset.orderId
                        );

                    }
                );

            }
        );

}


// =====================================================
// SHOW ORDER
// =====================================================

async function showOrder(
    orderId
) {

    const modalElement =
        document.getElementById(
            "adminOrderModal"
        );


    const details =
        document.getElementById(
            "adminOrderDetails"
        );


    if (!modalElement || !details) {

        return;

    }


    details.innerHTML = `

        <div class="text-center py-5">

            <div class="spinner-border"></div>

            <p class="mt-3 mb-0">
                Loading order...
            </p>

        </div>

    `;


    bootstrap.Modal
        .getOrCreateInstance(
            modalElement
        )
        .show();


    try {

        const response =
            await API.get(
                `/admin/orders/${orderId}`
            );


        const data =
            response.data;


        if (
            !data ||
            !data.success ||
            !data.order
        ) {

            throw new Error(
                data?.message ||
                "Unable to load order."
            );

        }


        const order =
            data.order;


        const items =
            order.items || [];


        details.innerHTML = `

            <div class="row g-4">


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        Customer Information
                    </h6>

                    <div class="bg-light rounded p-3">

                        <p class="mb-2">

                            <strong>
                                Name:
                            </strong>

                            ${escapeHtml(
                                order.customerName
                            )}

                        </p>


                        <p class="mb-2">

                            <strong>
                                Phone:
                            </strong>

                            ${escapeHtml(
                                order.customerPhone
                            )}

                        </p>


                        <p class="mb-0">

                            <strong>
                                Email:
                            </strong>

                            ${escapeHtml(
                                order.customerEmail
                            )}

                        </p>

                    </div>

                </div>


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        ${order.fulfillmentType === "pickup" ? "Customer Pickup" : "Delivery Address"}
                    </h6>

                    <div class="bg-light rounded p-3">

                        ${escapeHtml(
                            order.fulfillmentType === "pickup"
                                ? "Customer will collect this order. Delivery charge: ₦0."
                                : order.deliveryAddress
                        )}

                    </div>

                </div>


                <div class="col-12">

                    <h6 class="fw-bold">
                        Products
                    </h6>

                    <div class="table-responsive">

                        <table class="table">

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Qty
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${
                                    items.map(
                                        item => `

                                            <tr>

                                                <td>
                                                    ${escapeHtml(
                                                        item.name
                                                    )}
                                                </td>

                                                <td>
                                                    ₦${Number(
                                                        item.price || 0
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    ${Number(
                                                        item.quantity || 0
                                                    )}
                                                </td>

                                                <td>
                                                    ₦${(
                                                        Number(
                                                            item.price || 0
                                                        ) *
                                                        Number(
                                                            item.quantity || 0
                                                        )
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>

                                        `
                                    ).join("")
                                }

                            </tbody>

                        </table>

                    </div>

                </div>


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        Payment
                    </h6>

                    <div class="bg-light rounded p-3">

                        <p class="mb-2">

                            <strong>
                                Status:
                            </strong>

                            ${paymentBadge(
                                order.paymentStatus
                            )}

                        </p>


                        <p class="mb-0">

                            <strong>
                                Reference:
                            </strong>

                            <small class="d-block text-break mt-1">

                                ${escapeHtml(
                                    order.paymentReference ||
                                    "—"
                                )}

                            </small>

                        </p>

                    </div>

                </div>


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        Order Status
                    </h6>

                    <div class="bg-light rounded p-3">${statusControl(order)}</div>

                </div>


                <div class="col-12">

                    <div class="border-top pt-3">

                        <div class="d-flex justify-content-between">

                            <strong>
                                Order Total
                            </strong>

                            <strong class="fs-4">
                                ₦${Number(
                                    order.total || 0
                                ).toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        `;


        const updateButton =
            document.getElementById(
                "updateOrderStatusButton"
            );


        if (updateButton) {

            updateButton.addEventListener(
                "click",
                () => {

                    updateOrderStatus(
                        order.id
                    );

                }
            );

        }


    } catch (error) {

        console.error(
            "❌ Order details error:",
            error
        );


        details.innerHTML = `

            <div class="alert alert-danger">

                ${escapeHtml(
                    error.message
                )}

            </div>

        `;

    }

}


// =====================================================
// STATUS OPTIONS
// =====================================================

function nextAdminStatuses(order) {
    const current = order.orderStatus;
    if (["delivered", "cancelled"].includes(current)) return [];
    if (order.fulfillmentType === "pickup") return ({ pending:["processing","cancelled"], processing:["ready_for_pickup","cancelled"], ready_for_pickup:["delivered","cancelled"] })[current] || [];
    return ({ pending:["processing","cancelled"], processing:["cancelled"] })[current] || [];
}

function commandLabel(status, pickup) {
    return ({ processing:"Start Preparing", ready_for_pickup:"Mark Ready for Pickup", delivered:pickup?"Mark as Collected":"Delivered", cancelled:"Cancel Order" })[status];
}

function statusControl(order) {
    const statuses = nextAdminStatuses(order);
    if (!statuses.length) return `<span class="badge text-bg-secondary">No further admin action</span><p class="small text-secondary mb-0 mt-2">${order.fulfillmentType === "delivery" && !["delivered","cancelled"].includes(order.orderStatus)?"Delivery progress is controlled by the assigned rider.":"This order is complete and locked."}</p>`;
    return `<label for="adminOrderStatus" class="form-label small fw-semibold">Available action</label><select id="adminOrderStatus" class="form-select">${statuses.map(status=>`<option value="${status}">${commandLabel(status,order.fulfillmentType==="pickup")}</option>`).join("")}</select><button type="button" id="updateOrderStatusButton" data-order-id="${escapeHtml(order.id)}" class="btn btn-dark w-100 mt-3"><i class="bi bi-check2-circle me-2"></i>Apply Action</button>`;
}


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

async function updateOrderStatus(
    orderId
) {

    const select =
        document.getElementById(
            "adminOrderStatus"
        );


    const button =
        document.getElementById(
            "updateOrderStatusButton"
        );


    if (!select || !button) {

        return;

    }


    const status =
        select.value;


    try {

        button.disabled =
            true;


        button.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Updating...

        `;


        const response =
            await API.patch(
                `/admin/orders/${orderId}/status`,
                {
                    status
                }
            );


        const data =
            response.data;


        if (
            !data ||
            !data.success
        ) {

            throw new Error(
                data?.message ||
                "Unable to update order status."
            );

        }


        await loadAdminOrders();


        bootstrap.Modal
            .getOrCreateInstance(
                document.getElementById(
                    "adminOrderModal"
                )
            )
            .hide();


        alert(
            `Order #${orderId} is now ${status}.`
        );


    } catch (error) {

        console.error(
            "❌ Update status error:",
            error
        );


        alert(
            "Unable to update order status.\n\n" +
            error.message
        );


        button.disabled =
            false;


        button.innerHTML = `

            <i class="bi bi-check2-circle me-2"></i>

            Update Status

        `;

    }

}


// =====================================================
// FILTERS
// =====================================================

export function setupAdminFilters() {

    const search =
        document.getElementById(
            "orderSearch"
        );


    const payment =
        document.getElementById(
            "paymentFilter"
        );


    const status =
        document.getElementById(
            "statusFilter"
        );


    const filter = () => {

        const orders =
            window.nutriDustAdminOrders ||
            [];


        const searchValue =
            String(
                search?.value || ""
            )
                .toLowerCase()
                .trim();


        const paymentValue =
            payment?.value ||
            "all";


        const statusValue =
            status?.value ||
            "all";


        const filtered =
            orders.filter(
                order => {

                    const text =
                        [
                            order.id,
                            order.customerName,
                            order.customerEmail
                        ]
                            .join(" ")
                            .toLowerCase();


                    const matchesSearch =
                        !searchValue ||
                        text.includes(
                            searchValue
                        );


                    const matchesPayment =
                        paymentValue === "all" ||
                        order.paymentStatus ===
                        paymentValue;


                    const matchesStatus =
                        statusValue === "all" ||
                        order.orderStatus ===
                        statusValue;


                    return (
                        matchesSearch &&
                        matchesPayment &&
                        matchesStatus
                    );

                }
            );


        renderOrders(
            filtered
        );

    };


    search?.addEventListener(
        "input",
        filter
    );


    payment?.addEventListener(
        "change",
        filter
    );


    status?.addEventListener(
        "change",
        filter
    );

}


// =====================================================
// REFRESH
// =====================================================

export function setupAdminRefresh() {

    const button =
        document.getElementById(
            "refreshOrdersButton"
        );


    button?.addEventListener(
        "click",
        async () => {

            button.disabled =
                true;


            button.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Refreshing...

            `;


            await loadAdminOrders();


            button.disabled =
                false;


            button.innerHTML = `

                <i class="bi bi-arrow-clockwise me-2"></i>

                Refresh

            `;

        }
    );

}


// =====================================================
// ADMIN LOGOUT
// =====================================================

export function setupAdminLogout() {

    const button =
        document.getElementById(
            "adminLogoutButton"
        );


    if (!button) {

        console.error(
            "❌ Admin logout button not found."
        );

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            console.log(
                "🔓 Logging out admin..."
            );


            logoutAdmin();

        }
    );


    console.log(
        "✅ Admin logout button is active."
    );

}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    value
) {

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
