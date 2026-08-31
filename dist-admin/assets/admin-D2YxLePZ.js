import{t as e}from"./axios-_aN4D4J9.js";import{i as t,n,r,t as i}from"./liveTrackingMap-LZgxnnmp.js";var a=e.create({baseURL:`https://nutridustfoods.onrender.com/api`});function o(){return`

        <div class="container py-5">

            <div class="row justify-content-center">

                <div class="col-md-5">

                    <div class="card border-0 shadow-lg">

                        <div class="card-body p-4 p-md-5">

                            <div class="text-center mb-4">

                                <i
                                    class="bi bi-shield-lock-fill"
                                    style="font-size: 3rem;"
                                ></i>

                                <h2 class="fw-bold mt-3">
                                    NutriDust Admin
                                </h2>

                                <p class="text-muted">
                                    Secure Administrator Login
                                </p>

                            </div>


                            <form id="adminLoginForm">

                                <div class="mb-3">

                                    <label
                                        class="form-label fw-semibold"
                                    >
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        id="adminUsername"
                                        class="form-control"
                                        placeholder="Enter username"
                                        required
                                        autocomplete="username"
                                    >

                                </div>


                                <div class="mb-3">

                                    <label
                                        class="form-label fw-semibold"
                                    >
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="adminPassword"
                                        class="form-control"
                                        placeholder="Enter password"
                                        required
                                        autocomplete="current-password"
                                    >

                                </div>


                                <div
                                    id="adminLoginError"
                                    class="alert alert-danger d-none"
                                ></div>


                                <button
                                    type="submit"
                                    id="adminLoginButton"
                                    class="btn btn-dark w-100"
                                >

                                    <i
                                        class="bi bi-box-arrow-in-right me-2"
                                    ></i>

                                    Login

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `}function s(){return!!localStorage.getItem(`nutridust-admin-token`)}async function c(e,t){let n=(await a.post(`/admin/login`,{username:e,password:t})).data;if(!n||!n.success||!n.token)throw Error(n?.message||`Login failed.`);return localStorage.setItem(`nutridust-admin-token`,n.token),localStorage.setItem(`nutridust-admin-user`,JSON.stringify(n.admin)),n}function l(){localStorage.removeItem(`nutridust-admin-token`),localStorage.removeItem(`nutridust-admin-user`),window.location.href=`/admin.html`}function u(){try{return JSON.parse(localStorage.getItem(`nutridust-admin-user`)||`null`)}catch{return null}}function d(e){if(!e)return`—`;let t=String(e).trim();/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(t)&&(t=t.replace(` `,`T`)+`Z`);let n=new Date(t);return Number.isNaN(n.getTime())?String(e):n.toLocaleString(`en-NG`,{timeZone:`Africa/Lagos`,day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hour12:!0})}var f=e.create({baseURL:`https://nutridustfoods.onrender.com/api`});f.interceptors.request.use(e=>{let t=localStorage.getItem(`nutridust-admin-token`);return t&&(e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e));function p(){return`

        <div class="container-fluid py-4 px-lg-5 admin-orders-page">

            <!-- HEADER -->

            <div class="d-flex justify-content-between align-items-center mb-4 admin-orders-title">

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

            <div class="row g-3 mb-4 admin-orders-stats">

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

            <div class="card border-0 shadow-sm mb-4 admin-orders-filters">

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
                                    Unpaid / Pending
                                </option>

                                <option value="failed">
                                    Failed
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

                                <option value="failed">
                                    Failed
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ORDERS -->

            <div class="card border-0 shadow-sm admin-orders-list">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center gap-2 mb-3 admin-orders-list-heading">

                        <h4 class="fw-bold mb-0">
                            Orders
                        </h4>

                        <div class="d-flex align-items-center gap-2">
                            <button type="button" class="btn btn-sm btn-outline-success" id="exportOrdersExcelButton"><i class="bi bi-file-earmark-spreadsheet me-1"></i>Excel</button>
                            <button type="button" class="btn btn-sm btn-outline-danger" id="exportOrdersPdfButton"><i class="bi bi-file-earmark-pdf me-1"></i>PDF</button>
                            <span id="ordersCount" class="badge bg-dark">0 Orders</span>
                        </div>

                    </div>


                    <div class="table-responsive admin-order-records-scroll">

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

    `}async function m(){try{let e=(await f.get(`/admin/orders`)).data;if(!e||!e.success)throw Error(e?.message||`Unable to load orders.`);let t=e.orders||[];return window.nutriDustAdminOrders=t,h(t),b(),t}catch(e){console.error(`❌ Admin order loading error:`,e);let t=document.getElementById(`ordersTableBody`);return t&&(t.innerHTML=`

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
                            ${w(e.message)}
                        </small>

                    </td>

                </tr>

            `),[]}}function h(e){let t=e.length,n=e.filter(e=>e.paymentStatus===`paid`).length,r=e.filter(e=>e.paymentStatus!==`paid`).length,i=e.filter(e=>e.paymentStatus===`paid`).reduce((e,t)=>e+Number(t.total||0),0),a=document.getElementById(`totalOrders`),o=document.getElementById(`totalSales`),s=document.getElementById(`paidOrders`),c=document.getElementById(`pendingOrders`);a&&(a.textContent=t),o&&(o.textContent=`₦${i.toLocaleString()}`),s&&(s.textContent=n),c&&(c.textContent=r)}function g(e){let t=document.getElementById(`ordersTableBody`),n=document.getElementById(`ordersCount`);if(t){if(n&&(n.textContent=`${e.length} Order${e.length===1?``:`s`}`),!e.length){t.innerHTML=`

            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted py-5"
                >

                    No orders found.

                </td>

            </tr>

        `;return}t.innerHTML=e.map(e=>`

                <tr>

                    <td>
                        <strong>
                            #${w(e.id)}
                        </strong>
                    </td>


                    <td>

                        <div class="fw-semibold">
                            ${w(e.customerName)}
                        </div>

                        <small class="text-muted">
                            ${w(e.customerEmail)}
                        </small>

                    </td>


                    <td>

                        <strong>
                            ₦${Number(e.total||0).toLocaleString()}
                        </strong>

                    </td>


                    <td>
                        ${_(e.paymentStatus)}
                    </td>


                    <td>
                        ${v(e.orderStatus)}
                    </td>


                    <td>

    <small>
        ${d(e.createdAt)}
    </small>

</td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-sm btn-dark view-admin-order"
                            data-order-id="${w(e.id)}"
                        >

                            <i class="bi bi-eye me-1"></i>

                            View

                        </button>

                    </td>

                </tr>

            `).join(``),y()}}function _(e){return e===`paid`?`

            <span class="badge bg-success">
                Paid
            </span>

        `:`

        <span class="badge bg-warning text-dark">
            Pending
        </span>

    `}function v(e){let t=String(e||`pending`).toLowerCase();return`

        <span class="badge ${{pending:`bg-warning text-dark`,processing:`bg-primary`,ready_for_pickup:`bg-info text-dark`,out_for_delivery:`bg-info text-dark`,delivered:`bg-success`,cancelled:`bg-danger`}[t]||`bg-secondary`}">

            ${{pending:`Pending`,processing:`Processing`,ready_for_pickup:`Ready for Pickup`,out_for_delivery:`On Delivery`,delivered:`Delivered`,cancelled:`Cancelled`}[t]||t}

        </span>

    `}function y(){document.querySelectorAll(`.view-admin-order`).forEach(e=>{e.addEventListener(`click`,()=>{ee(e.dataset.orderId)})})}async function ee(e){let n=document.getElementById(`adminOrderModal`),r=document.getElementById(`adminOrderDetails`);if(!(!n||!r)){r.innerHTML=`

        <div class="text-center py-5">

            <div class="spinner-border"></div>

            <p class="mt-3 mb-0">
                Loading order...
            </p>

        </div>

    `,t.getOrCreateInstance(n).show();try{let t=(await f.get(`/admin/orders/${e}`)).data;if(!t||!t.success||!t.order)throw Error(t?.message||`Unable to load order.`);let n=t.order,i=n.items||[];r.innerHTML=`

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

                            ${w(n.customerName)}

                        </p>


                        <p class="mb-2">

                            <strong>
                                Phone:
                            </strong>

                            ${w(n.customerPhone)}

                        </p>


                        <p class="mb-0">

                            <strong>
                                Email:
                            </strong>

                            ${w(n.customerEmail)}

                        </p>

                    </div>

                </div>


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        ${n.fulfillmentType===`pickup`?`Customer Pickup`:`Delivery Address`}
                    </h6>

                    <div class="bg-light rounded p-3">

                        ${w(n.fulfillmentType===`pickup`?`Customer will collect this order. Delivery charge: ₦0.`:n.deliveryAddress)}

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

                                ${i.map(e=>`

                                            <tr>

                                                <td>
                                                    ${w(e.name)}
                                                </td>

                                                <td>
                                                    ₦${Number(e.price||0).toLocaleString()}
                                                </td>

                                                <td>
                                                    ${Number(e.quantity||0)}
                                                </td>

                                                <td>
                                                    ₦${(Number(e.price||0)*Number(e.quantity||0)).toLocaleString()}
                                                </td>

                                            </tr>

                                        `).join(``)}

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

                            ${_(n.paymentStatus)}

                        </p>


                        <p class="mb-0">

                            <strong>
                                Reference:
                            </strong>

                            <small class="d-block text-break mt-1">

                                ${w(n.paymentReference||`—`)}

                            </small>

                        </p>

                    </div>

                </div>


                <div class="col-md-6">

                    <h6 class="fw-bold">
                        Order Status
                    </h6>

                    <div class="bg-light rounded p-3">${re(n)}</div>

                </div>


                <div class="col-12">

                    <div class="border-top pt-3">

                        <div class="d-flex justify-content-between">

                            <strong>
                                Order Total
                            </strong>

                            <strong class="fs-4">
                                ₦${Number(n.total||0).toLocaleString()}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        `;let a=document.getElementById(`updateOrderStatusButton`);a&&a.addEventListener(`click`,()=>{ie(n.id)})}catch(e){console.error(`❌ Order details error:`,e),r.innerHTML=`

            <div class="alert alert-danger">

                ${w(e.message)}

            </div>

        `}}}function te(e){let t=e.orderStatus;return[`delivered`,`cancelled`].includes(t)?[]:e.fulfillmentType===`pickup`?{pending:[`processing`,`cancelled`],processing:[`ready_for_pickup`,`cancelled`],ready_for_pickup:[`delivered`,`cancelled`]}[t]||[]:{pending:[`processing`,`cancelled`],processing:[`cancelled`]}[t]||[]}function ne(e,t){return{processing:`Start Preparing`,ready_for_pickup:`Mark Ready for Pickup`,delivered:t?`Mark as Collected`:`Delivered`,cancelled:`Cancel Order`}[e]}function re(e){if(!window.nutridustAdminCan?.(`orders.update`))return`<span class="badge text-bg-secondary">View only</span>`;let t=te(e);return t.length?`<label for="adminOrderStatus" class="form-label small fw-semibold">Available action</label><select id="adminOrderStatus" class="form-select">${t.map(t=>`<option value="${t}">${ne(t,e.fulfillmentType===`pickup`)}</option>`).join(``)}</select><button type="button" id="updateOrderStatusButton" data-order-id="${w(e.id)}" class="btn btn-dark w-100 mt-3"><i class="bi bi-check2-circle me-2"></i>Apply Action</button>`:`<span class="badge text-bg-secondary">No further admin action</span><p class="small text-secondary mb-0 mt-2">${e.fulfillmentType===`delivery`&&![`delivered`,`cancelled`].includes(e.orderStatus)?`Delivery progress is controlled by the assigned rider.`:`This order is complete and locked.`}</p>`}async function ie(e){let n=document.getElementById(`adminOrderStatus`),r=document.getElementById(`updateOrderStatusButton`);if(!n||!r)return;let i=n.value;try{r.disabled=!0,r.innerHTML=`

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Updating...

        `;let n=(await f.patch(`/admin/orders/${e}/status`,{status:i})).data;if(!n||!n.success)throw Error(n?.message||`Unable to update order status.`);await m(),t.getOrCreateInstance(document.getElementById(`adminOrderModal`)).hide(),alert(`Order #${e} is now ${i}.`)}catch(e){console.error(`❌ Update status error:`,e),alert(`Unable to update order status.

`+e.message),r.disabled=!1,r.innerHTML=`

            <i class="bi bi-check2-circle me-2"></i>

            Update Status

        `}}function b(){let e=window.nutriDustAdminOrders||[],t=String(document.getElementById(`orderSearch`)?.value||``).toLowerCase().trim(),n=String(document.getElementById(`paymentFilter`)?.value||`all`).toLowerCase(),r=String(document.getElementById(`statusFilter`)?.value||`all`).toLowerCase();g(e.filter(e=>{let i=[e.id,`#${e.id}`,e.customerName,e.customerEmail,e.customerPhone].join(` `).toLowerCase(),a=String(e.paymentStatus||``).toLowerCase(),o=String(e.orderStatus||``).toLowerCase();return(!t||i.includes(t))&&(n===`all`||a===n)&&(r===`all`||o===r)}))}async function x(e){if(![`excel`,`pdf`].includes(e))return;let t=document.getElementById(e===`excel`?`exportOrdersExcelButton`:`exportOrdersPdfButton`),n=t?.innerHTML;t&&(t.disabled=!0,t.innerHTML=`<span class="spinner-border spinner-border-sm"></span>`);try{let t={search:document.getElementById(`orderSearch`)?.value||``,payment:document.getElementById(`paymentFilter`)?.value||`all`,status:document.getElementById(`statusFilter`)?.value||`all`},n=await f.get(`/admin/orders/reports/${e}`,{params:t,responseType:`blob`}),r=URL.createObjectURL(n.data),i=document.createElement(`a`);i.href=r,i.download=`nutridust-orders-${new Date().toISOString().slice(0,10)}.${e===`excel`?`xlsx`:`pdf`}`,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}catch{window.alert(`Unable to export the ${e===`excel`?`Excel`:`PDF`} order report. Please try again.`)}finally{t&&(t.disabled=!1,t.innerHTML=n)}}function S(){let e=document.getElementById(`orderSearch`),t=document.getElementById(`paymentFilter`),n=document.getElementById(`statusFilter`);e?.addEventListener(`input`,b),t?.addEventListener(`change`,b),n?.addEventListener(`change`,b),document.getElementById(`exportOrdersExcelButton`)?.addEventListener(`click`,()=>x(`excel`)),document.getElementById(`exportOrdersPdfButton`)?.addEventListener(`click`,()=>x(`pdf`))}function C(){let e=document.getElementById(`refreshOrdersButton`);e?.addEventListener(`click`,async()=>{e.disabled=!0,e.innerHTML=`

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Refreshing...

            `,await m(),e.disabled=!1,e.innerHTML=`

                <i class="bi bi-arrow-clockwise me-2"></i>

                Refresh

            `})}function ae(){let e=document.getElementById(`adminLogoutButton`);if(!e){console.error(`❌ Admin logout button not found.`);return}e.addEventListener(`click`,()=>{window.confirm(`Are you sure you want to logout?`)&&(console.log(`🔓 Logging out admin...`),l())}),console.log(`✅ Admin logout button is active.`)}function w(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function oe(){let e=document.querySelector(`.admin-taskbar`),t=document.querySelector(`.admin-orders-filters`);if(!e||!t)return;let n=()=>{document.documentElement.style.setProperty(`--admin-taskbar-height`,`${Math.ceil(e.getBoundingClientRect().height)}px`),document.documentElement.style.setProperty(`--admin-orders-filter-height`,`${Math.ceil(t.getBoundingClientRect().height)}px`)};n();let r=new ResizeObserver(n);r.observe(e),r.observe(t),window.addEventListener(`resize`,n,{passive:!0})}var T=e.create({baseURL:`https://nutridustfoods.onrender.com/api`});T.interceptors.request.use(e=>{let t=localStorage.getItem(`nutridust-admin-token`);return t&&(e.headers.Authorization=`Bearer ${t}`),e});var E=[];function se(){return`

        <div class="container-fluid py-4 px-lg-5 admin-records-view admin-products-view">

            <div class="d-flex justify-content-between align-items-center mb-4 admin-records-header">

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

            <div class="card border-0 shadow-sm admin-records-card">

                <div class="card-body">

                    <div class="table-responsive admin-records-scroll">

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

    `}async function D(){let e=document.getElementById(`adminProductsTableBody`);if(e)try{let[t,n]=await Promise.all([T.get(`/admin/products`),T.get(`/admin/inventory`)]),r=t.data,i=n.data,a=r.products||r||[];if(E=i.inventory||[],!Array.isArray(a))throw Error(`Invalid products response.`);if(!a.length){e.innerHTML=`

                <tr>

                    <td
                        colspan="9"
                        class="text-center text-muted py-5"
                    >

                        No products found.

                    </td>

                </tr>

            `;return}e.innerHTML=a.map(e=>{let t=E.find(t=>String(t.productId)===String(e.id)),n=Number(t?.totalProduced||0),r=Number(t?.totalSold||0),i=Number(t?.quantityAvailable||0),a=Number(t?.lowStockThreshold||10),o;o=i<=0?`

                        <span class="badge bg-danger">

                            <i class="bi bi-x-circle me-1"></i>

                            Out of Stock

                        </span>

                    `:i<=a?`

                        <span class="badge bg-warning text-dark">

                            <i class="bi bi-exclamation-triangle me-1"></i>

                            Low Stock

                        </span>

                    `:`

                        <span class="badge bg-success">

                            <i class="bi bi-check-circle me-1"></i>

                            In Stock

                        </span>

                    `;let s=e.image?e.image.startsWith(`http`)?e.image:`https://nutridustfoods.onrender.com${e.image}`:``;return`

                    <tr>


                        <!-- IMAGE -->

                        <td>

                            ${s?`

                                        <img
                                            src="${N(s)}"
                                            alt="${N(e.name)}"
                                            style="
                                                width:60px;
                                                height:60px;
                                                object-fit:cover;
                                                border-radius:8px;
                                            "
                                            onerror="this.style.display='none';"
                                        >

                                    `:`

                                        <div
                                            class="bg-light rounded d-flex align-items-center justify-content-center"
                                            style="
                                                width:60px;
                                                height:60px;
                                            "
                                        >

                                            <i class="bi bi-image text-muted"></i>

                                        </div>

                                    `}

                        </td>


                        <!-- PRODUCT -->

                        <td>

                            <strong>

                                ${N(e.name)}

                            </strong>

                            <small class="d-block text-muted">

                                #${e.id}

                            </small>

                        </td>


                        <!-- CATEGORY -->

                        <td>

                            ${N(e.category)}

                        </td>


                        <!-- PRICE -->

                        <td>

                            <strong>

                                ₦${Number(e.price||0).toLocaleString()}

                            </strong>

                        </td>


                        <!-- PRODUCED -->

                        <td>

                            <span class="fw-bold text-primary">

                                ${n.toLocaleString()}

                            </span>

                        </td>


                        <!-- SOLD -->

                        <td>

                            <span class="fw-bold text-danger">

                                ${r.toLocaleString()}

                            </span>

                        </td>


                        <!-- AVAILABLE -->

                        <td>

                            <span
                                class="
                                    fw-bold
                                    ${i<=0?`text-danger`:i<=a?`text-warning`:`text-success`}
                                "
                            >

                                ${i.toLocaleString()}

                            </span>

                        </td>


                        <!-- STATUS -->

                        <td>

                            ${o}

                        </td>


                        <!-- ACTION -->

                        <td>

                            <div class="d-flex gap-1 flex-wrap">

                                <button
                                    class="btn btn-sm btn-success manage-inventory"
                                    data-id="${e.id}"
                                >

                                    <i class="bi bi-boxes me-1"></i>

                                    Stock

                                </button>


                                <button
                                    class="btn btn-sm btn-outline-dark edit-product"
                                    data-id="${e.id}"
                                >

                                    <i class="bi bi-pencil me-1"></i>

                                    Edit

                                </button>


                                <button
                                    class="btn btn-sm btn-outline-danger delete-product"
                                    data-id="${e.id}"
                                >

                                    <i class="bi bi-trash me-1"></i>

                                    Delete

                                </button>

                            </div>

                        </td>


                    </tr>

                `}).join(``),ce(a)}catch(t){console.error(`❌ Product/inventory loading error:`,t),e.innerHTML=`

            <tr>

                <td
                    colspan="9"
                    class="text-center text-danger py-5"
                >

                    Unable to load products and inventory.

                    <br>

                    <small>

                        ${N(t.message)}

                    </small>

                </td>

            </tr>

        `}}function ce(e){window.nutridustAdminCan?.(`products.manage`)||document.querySelectorAll(`.edit-product, .delete-product`).forEach(e=>e.remove()),document.querySelectorAll(`.edit-product`).forEach(t=>{t.addEventListener(`click`,()=>{let n=e.find(e=>String(e.id)===String(t.dataset.id));n&&j(n)})}),document.querySelectorAll(`.delete-product`).forEach(e=>{e.addEventListener(`click`,()=>{fe(e.dataset.id)})}),document.querySelectorAll(`.manage-inventory`).forEach(e=>{e.addEventListener(`click`,()=>{O(e.dataset.id)})})}async function O(e){let n=E.find(t=>String(t.productId)===String(e));if(!n){alert(`Inventory record not found.`);return}document.getElementById(`inventoryModalTitle`).textContent=`Manage Inventory`,document.getElementById(`inventoryModalSubtitle`).textContent=n.name;let r=document.getElementById(`inventorySummary`);r.innerHTML=`

        <div class="col-md-4">

            <div class="card bg-primary text-white border-0">

                <div class="card-body">

                    <small>Total Produced</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(n.totalProduced||0).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="card bg-danger text-white border-0">

                <div class="card-body">

                    <small>Total Sold</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(n.totalSold||0).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>


        <div class="col-md-4">

            <div class="card bg-success text-white border-0">

                <div class="card-body">

                    <small>Available</small>

                    <h3 class="fw-bold mb-0">

                        ${Number(n.quantityAvailable||0).toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>

    `,document.getElementById(`productionQuantity`).value=``,document.getElementById(`productionNote`).value=``,document.getElementById(`adjustmentQuantity`).value=``,document.getElementById(`adjustmentNote`).value=``;let i=document.getElementById(`inventoryModal`);i.dataset.productId=e,await k(e),t.getOrCreateInstance(i).show()}async function le(){let e=document.getElementById(`inventoryModal`)?.dataset?.productId,t=Number(document.getElementById(`productionQuantity`)?.value),n=document.getElementById(`productionNote`)?.value?.trim()||``;if(!e){alert(`Product not selected.`);return}if(!Number.isInteger(t)||t<=0){alert(`Enter a valid production quantity.`);return}let r=document.getElementById(`addProductionButton`);try{r.disabled=!0,r.innerHTML=`

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Adding...

        `,await T.post(`/admin/inventory/${e}/production`,{quantity:t,note:n}),alert(`Production quantity added successfully.`),await D(),await O(e)}catch(e){console.error(`❌ Add production error:`,e),alert(`Unable to add production.

`+(e?.response?.data?.message||e.message||`Unknown error`))}finally{r.disabled=!1,r.innerHTML=`

            <i class="bi bi-plus-circle me-2"></i>

            Add Production

        `}}async function ue(){let e=document.getElementById(`inventoryModal`)?.dataset?.productId,t=Number(document.getElementById(`adjustmentQuantity`)?.value),n=document.getElementById(`adjustmentNote`)?.value?.trim()||``;if(!e){alert(`Product not selected.`);return}if(!Number.isInteger(t)||t===0){alert(`Enter a valid adjustment quantity.`);return}if(!n){alert(`Please enter a reason for the adjustment.`);return}let r=document.getElementById(`adjustInventoryButton`);try{r.disabled=!0,r.innerHTML=`

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            Adjusting...

        `,await T.patch(`/admin/inventory/${e}/adjust`,{quantity:t,note:n}),alert(`Inventory adjusted successfully.`),await D(),await O(e)}catch(e){console.error(`❌ Inventory adjustment error:`,e),alert(`Unable to adjust inventory.

`+(e?.response?.data?.message||e.message||`Unknown error`))}finally{r.disabled=!1,r.innerHTML=`

            <i class="bi bi-sliders me-2"></i>

            Adjust Stock

        `}}async function k(e){let t=document.getElementById(`inventoryHistory`);if(t){t.innerHTML=`

        <div class="text-center py-3">

            <span
                class="spinner-border spinner-border-sm"
            ></span>

            Loading history...

        </div>

    `;try{let n=(await T.get(`/admin/inventory/${e}/history`)).data,r=Array.isArray(n.movements)?n.movements:[];if(!r.length){t.innerHTML=`

                <div class="text-center text-muted py-4">

                    <i class="bi bi-clock-history display-6"></i>

                    <p class="mt-2 mb-0">

                        No inventory movements yet.

                    </p>

                </div>

            `;return}t.innerHTML=`

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

                    ${r.map(e=>{let t=Number(e.quantity),n=t>0,r=String(e.movementType||``).toLowerCase(),i=`bg-secondary`,a=`bi-arrow-left-right`;r===`production`?(i=`bg-success`,a=`bi-box-seam`):r===`sale`?(i=`bg-danger`,a=`bi-cart-check`):r===`reservation`?(i=`bg-warning text-dark`,a=`bi-clock`):r===`adjustment`&&(i=`bg-warning text-dark`,a=`bi-sliders`);let o=e.performedBy||e.performed_by||`SYSTEM`,s=e.note||``;return`

                                <tr>

                                    <!-- DATE -->

                                    <td>

                                        ${he(e.createdAt)}

                                    </td>


                                    <!-- TYPE -->

                                    <td>

                                        <span
                                            class="badge ${i}"
                                        >

                                            <i
                                                class="bi ${a} me-1"
                                            ></i>

                                            ${N(r||`unknown`)}

                                        </span>

                                    </td>


                                    <!-- QUANTITY -->

                                    <td>

                                        <strong
                                            class="${n?`text-success`:`text-danger`}"
                                        >

                                            ${n?`+`:``}${t}

                                        </strong>

                                    </td>


                                    <!-- NOTE -->

                                    <td>

                                        ${N(s)}

                                    </td>


                                    <!-- PERFORMED BY -->

                                    <td>

                                        <span
                                            class="fw-semibold"
                                        >

                                            <i
                                                class="bi bi-person-circle me-1"
                                            ></i>

                                            ${N(o)}

                                        </span>

                                    </td>

                                </tr>

                            `}).join(``)}

                </tbody>

            </table>

        `}catch(e){console.error(`❌ Inventory history error:`,e),t.innerHTML=`

            <div class="alert alert-danger">

                Unable to load inventory history.

                <br>

                <small>

                    ${N(e?.response?.data?.message||e.message||`Unknown error`)}

                </small>

            </div>

        `}}}async function A(e){let t=document.getElementById(`inventoryModal`)?.dataset?.productId;if(!t||![`excel`,`pdf`].includes(e))return;let n=document.getElementById(e===`excel`?`exportInventoryExcelButton`:`exportInventoryPdfButton`),r=n?.innerHTML;n&&(n.disabled=!0,n.innerHTML=`<span class="spinner-border spinner-border-sm"></span>`);try{let n=await T.get(`/admin/inventory/reports/${e}`,{params:{productId:t},responseType:`blob`}),r=e===`excel`?`xlsx`:`pdf`,i=URL.createObjectURL(n.data),a=document.createElement(`a`);a.href=i,a.download=`nutridust-inventory-product-${t}.${r}`,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(i)}catch{alert(`Unable to export the inventory report. Please try again.`)}finally{n&&(n.disabled=!1,n.innerHTML=r)}}function de(){document.getElementById(`adminProductForm`)?.reset(),document.getElementById(`productId`).value=``,document.getElementById(`productRating`).value=`5`,document.getElementById(`productModalTitle`).textContent=`Add Product`,document.getElementById(`productImagePreview`).innerHTML=``,t.getOrCreateInstance(document.getElementById(`adminProductModal`)).show()}function j(e){document.getElementById(`productId`).value=e.id||``,document.getElementById(`productName`).value=e.name||``,document.getElementById(`productCategory`).value=e.category||``,document.getElementById(`productDescription`).value=e.description||``,document.getElementById(`productImage`).value=``;let n=document.getElementById(`productImagePreview`);n&&e.image?n.innerHTML=`

            <div class="mt-2">

                <small class="text-muted d-block mb-1">

                    Current image

                </small>

                <img
                    src="${N(e.image.startsWith(`http`)?e.image:`https://nutridustfoods.onrender.com${e.image}`)}"
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

        `:n&&(n.innerHTML=``),document.getElementById(`productPrice`).value=e.price||``,document.getElementById(`productRating`).value=e.rating??5,document.getElementById(`productBadge`).value=e.badge||`NEW`,document.getElementById(`productModalTitle`).textContent=`Edit Product`,t.getOrCreateInstance(document.getElementById(`adminProductModal`)).show()}async function M(e){e.preventDefault();let n=document.getElementById(`productId`).value,r=document.getElementById(`productImage`),i=new FormData;i.append(`name`,document.getElementById(`productName`).value.trim()),i.append(`category`,document.getElementById(`productCategory`).value.trim()),i.append(`description`,document.getElementById(`productDescription`).value.trim()),i.append(`price`,document.getElementById(`productPrice`).value),i.append(`rating`,document.getElementById(`productRating`).value),i.append(`badge`,document.getElementById(`productBadge`).value.trim()),r&&r.files&&r.files.length>0&&i.append(`image`,r.files[0]);let a=document.getElementById(`saveProductButton`);try{a.disabled=!0,a.textContent=`Saving...`,n?await T.put(`/admin/products/${n}`,i):await T.post(`/admin/products`,i),await D(),t.getOrCreateInstance(document.getElementById(`adminProductModal`)).hide(),alert(n?`Product updated successfully.`:`Product added successfully.`)}catch(e){console.error(`❌ Save product error:`,e);let t=e?.response?.data?.message||e.message||`Unknown error`;alert(`Unable to save product.

`+t)}finally{a.disabled=!1,a.textContent=`Save Product`}}async function fe(e){if(confirm(`Delete product #${e}?`))try{await T.delete(`/admin/products/${e}`),await D(),alert(`Product deleted successfully.`)}catch(e){console.error(`❌ Delete product error:`,e);let t=e?.response?.data?.message||e.message||`Unknown error`;alert(`Unable to delete product.

`+t)}}function pe(){let e=document.getElementById(`productImage`),t=document.getElementById(`productImagePreview`);!e||!t||e.addEventListener(`change`,()=>{let n=e.files?.[0];if(!n){t.innerHTML=``;return}let r=URL.createObjectURL(n);t.innerHTML=`

                <div class="mt-2">

                    <small class="text-muted d-block mb-1">

                        Selected image

                    </small>

                    <img
                        src="${r}"
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

            `})}function me(){window.nutridustAdminCan?.(`products.manage`)||document.getElementById(`addProductButton`)?.remove(),window.nutridustAdminCan?.(`inventory.manage`)||(document.getElementById(`addProductionButton`)?.remove(),document.getElementById(`adjustInventoryButton`)?.remove()),document.getElementById(`addProductButton`)?.addEventListener(`click`,de),document.getElementById(`adminProductForm`)?.addEventListener(`submit`,M),document.getElementById(`addProductionButton`)?.addEventListener(`click`,le),document.getElementById(`adjustInventoryButton`)?.addEventListener(`click`,ue),document.getElementById(`refreshInventoryHistoryButton`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`inventoryModal`)?.dataset?.productId;e&&await k(e)}),document.getElementById(`exportInventoryExcelButton`)?.addEventListener(`click`,()=>A(`excel`)),document.getElementById(`exportInventoryPdfButton`)?.addEventListener(`click`,()=>A(`pdf`)),pe(),D()}function he(e){if(!e)return`—`;let t=new Date(e);return Number.isNaN(t.getTime())?N(e):t.toLocaleString()}function N(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var P=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),F=()=>({headers:{Authorization:`Bearer ${localStorage.getItem(`nutridust-admin-token`)}`}}),I={"orders.view":`View and receive orders`,"orders.update":`Update order status`,"products.view":`View products`,"products.manage":`Create and edit products`,"inventory.view":`View stock and reports`,"inventory.manage":`Add or adjust stock (storekeeper)`,"riders.view":`View riders and deliveries`,"riders.manage":`Create and manage riders`,"deliveries.assign":`Assign deliveries to riders`,"withdrawals.manage":`Process rider withdrawals`,"operations.view":`View operations overview`,"operations.run":`Run operations automation`,"staff.manage":`Create staff and assign access`},L=e=>String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`),R=(e=[],t=`permission`)=>Object.entries(I).map(([n,r])=>`<label class="form-check col-md-6 mb-2"><input class="form-check-input" type="checkbox" name="${t}" value="${n}" ${e.includes(n)?`checked`:``}><span class="form-check-label">${r}</span></label>`).join(``);function ge(){return`<section class="container-fluid px-lg-5 pb-5 admin-records-view admin-staff-view"><div class="card shadow-sm admin-records-card"><div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3 admin-records-header"><div><h2 class="h4 mb-1">Staff access</h2><p class="text-secondary mb-0">Create a user and select the exact tasks they may perform.</p></div><button class="btn btn-dark" id="openStaffForm">Create User</button></div>
        <div id="staffMessage"></div>
        <form id="staffForm" class="d-none mb-4 border rounded p-3">
            <div class="row g-2 mb-3"><div class="col-md-3"><input name="fullName" class="form-control" placeholder="Full name" required></div><div class="col-md-2"><input name="username" class="form-control" placeholder="Username" required></div><div class="col-md-2"><input name="password" type="password" minlength="8" class="form-control" placeholder="Temporary password" required></div><div class="col-md-2"><select name="role" class="form-select"><option value="staff">Staff</option><option value="manager">Manager</option><option value="accountant">Accountant</option><option value="cashier">Cashier</option><option value="support">Support</option></select></div><div class="col-md-3"><input name="phone" class="form-control" placeholder="Phone (optional)"></div></div>
            <h3 class="h6">Allowed tasks</h3><div class="row">${R()}</div><button class="btn btn-success mt-2">Create account</button>
        </form>
        <div class="table-responsive admin-records-scroll"><table class="table align-middle"><thead><tr><th>Name</th><th>Username</th><th>Job title</th><th>Allowed tasks</th><th>Status</th><th></th></tr></thead><tbody id="staffRows"><tr><td colspan="6">Loading...</td></tr></tbody></table></div>
    </div></div></section>`}async function _e(){let e=document.getElementById(`staffForm`),t=document.getElementById(`staffMessage`);document.getElementById(`openStaffForm`)?.addEventListener(`click`,()=>e.classList.toggle(`d-none`));let n=(e,n=`success`)=>{t.innerHTML=`<div class="alert alert-${n}">${L(e)}</div>`},r=async()=>{let{data:e}=await P.get(`/admin/staff`,F()),t=document.getElementById(`staffRows`);t.innerHTML=e.staff.map(e=>{let t=e.permissions.map(e=>I[e]||e);return`<tr><td>${L(e.fullName)}</td><td>${L(e.username)}</td><td><span class="badge text-bg-secondary">${L(e.role)}</span></td>
                <td><small>${t.map(L).join(`<br>`)||`No tasks assigned`}</small><details class="mt-2"><summary class="btn btn-sm btn-outline-dark">Edit access</summary><form class="permission-editor border rounded p-2 mt-2" data-staff-id="${e.id}"><div class="row">${R(e.permissions,`editPermission`)}</div><button class="btn btn-sm btn-success mt-2">Save access</button></form></details></td>
                <td>${L(e.accountStatus)}</td><td><button class="btn btn-sm btn-outline-secondary staff-status" data-staff-id="${e.id}" data-next-status="${e.accountStatus===`active`?`inactive`:`active`}">${e.accountStatus===`active`?`Disable`:`Enable`}</button></td></tr>`}).join(``)||`<tr><td colspan="6">No staff accounts yet.</td></tr>`,t.querySelectorAll(`.permission-editor`).forEach(e=>e.addEventListener(`submit`,async t=>{t.preventDefault();let i=[...e.querySelectorAll(`input[name="editPermission"]:checked`)].map(e=>e.value);try{await P.patch(`/admin/staff/${e.dataset.staffId}/permissions`,{permissions:i},F()),n(`Staff access updated.`),await r()}catch(e){n(e.response?.data?.message||`Unable to update staff access.`,`danger`)}})),t.querySelectorAll(`.staff-status`).forEach(e=>e.addEventListener(`click`,async()=>{try{await P.patch(`/admin/staff/${e.dataset.staffId}/status`,{accountStatus:e.dataset.nextStatus},F()),await r()}catch(e){n(e.response?.data?.message||`Unable to update account status.`,`danger`)}}))};e?.addEventListener(`submit`,async t=>{t.preventDefault();let i=Object.fromEntries(new FormData(e));i.permissions=[...e.querySelectorAll(`input[name="permission"]:checked`)].map(e=>e.value);try{await P.post(`/admin/staff`,i,F()),e.reset(),e.classList.add(`d-none`),n(`Staff account created.`),await r()}catch(e){n(e.response?.data?.message||`Unable to create account.`,`danger`)}}),await r()}var z=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),B=()=>({headers:{Authorization:`Bearer ${localStorage.getItem(`nutridust-admin-token`)}`}}),V=e=>String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]);function ve(){return`<section class="admin-riders-view">
 <header class="rider-page-header"><div><span class="admin-eyebrow">Fleet operations</span><h1>Rider management</h1><p>Review applications, assign deliveries and monitor riders in real time.</p></div><button id="refreshRiders" class="admin-icon-button" aria-label="Refresh riders"><i class="bi bi-arrow-clockwise"></i></button></header>
 <div class="rider-kpi-grid" aria-label="Rider summary">
  <article><i class="bi bi-people"></i><div><span>Active riders</span><strong id="riderStatActive">—</strong><small>Approved accounts</small></div></article>
  <article><i class="bi bi-broadcast-pin"></i><div><span>Available now</span><strong id="riderStatAvailable">—</strong><small>Ready for orders</small></div></article>
  <article><i class="bi bi-bicycle"></i><div><span>Busy riders</span><strong id="riderStatBusy">—</strong><small>On active work</small></div></article>
  <article><i class="bi bi-file-earmark-person"></i><div><span>Applications</span><strong id="riderStatApplications">—</strong><small>Awaiting review</small></div></article>
 </div>
 <div class="admin-section-tabs" role="tablist"><button type="button" class="admin-section-tab active" data-rider-panel="operations">Active riders &amp; delivery</button><button type="button" class="admin-section-tab" data-rider-panel="applications">Applications</button></div>
 <div id="riderAdminMessage"></div>
 <div class="rider-panel" data-rider-view="operations"><div class="rider-operations-grid">
  <section class="rider-fleet-card"><div class="panel-heading"><div><h2>Active rider operations</h2><p>Live availability, distance and delivery performance.</p></div><span class="live-pill"><i></i> Auto-refresh</span></div><div class="table-responsive admin-records-scroll"><table class="table align-middle"><thead><tr><th>Rider</th><th>Vehicle</th><th>Availability</th><th>Distance to shop</th><th>Deliveries</th><th>Earnings</th><th>Account</th></tr></thead><tbody id="riderRows"><tr><td colspan="7">Loading…</td></tr></tbody></table></div></section>
  <aside class="rider-control-column">
   <form id="assignRiderForm" class="rider-tool-card"><div class="rider-tool-title"><i class="bi bi-send"></i><div><span>Assign a delivery</span><small>Choose an order and available rider</small></div></div><label class="form-label" for="assignmentOrderId">Order number</label><input id="assignmentOrderId" name="orderId" type="number" min="1" class="form-control" placeholder="e.g. 74" required><label class="form-label" for="assignmentRider">Suggested rider</label><select name="riderId" id="assignmentRider" class="form-select" required><option value="">Select nearest available rider</option></select><button class="btn btn-success"><i class="bi bi-send me-1"></i>Assign delivery</button></form>
   <form id="adminLiveTrackingForm" class="rider-tool-card"><div class="rider-tool-title"><i class="bi bi-crosshair"></i><div><span>Track active order</span><small>Open the live delivery map</small></div></div><label class="form-label" for="adminTrackingOrderId">Order number</label><input id="adminTrackingOrderId" type="number" min="1" class="form-control" placeholder="e.g. 74" required><button class="btn btn-dark"><i class="bi bi-geo-alt-fill me-1"></i>Show live rider</button></form>
   <div id="adminLiveTracking" class="admin-live-tracking"><div class="tracking-empty-state"><i class="bi bi-map"></i><strong>Live map ready</strong><p>Enter an active delivery order to display the rider’s latest location.</p></div></div>
  </aside>
 </div></div>
 <div class="rider-panel" data-rider-view="applications" hidden><section class="rider-applications-card"><div class="panel-heading"><div><h2>Rider applications</h2><p>Verify submitted documents before onboarding a rider.</p></div></div><div id="applicationReview"></div><div class="table-responsive admin-records-scroll"><table class="table align-middle"><thead><tr><th>Applicant</th><th>Vehicle</th><th>Email</th><th>Inspection</th><th>Status</th><th>Action</th></tr></thead><tbody id="applicationRows"><tr><td colspan="6">Loading…</td></tr></tbody></table></div></section></div>
</section>`}async function H(){let e=document.getElementById(`riderAdminMessage`),t=document.getElementById(`riderRows`),r=document.getElementById(`applicationRows`),i=document.getElementById(`applicationReview`),a=document.getElementById(`assignmentRider`),o=document.getElementById(`assignRiderForm`),s=document.getElementById(`adminLiveTrackingForm`),c=document.getElementById(`adminTrackingOrderId`),l=document.getElementById(`adminLiveTracking`),u=null;c?.addEventListener(`invalid`,()=>{l.innerHTML=`<div class="alert alert-warning mb-0"><strong>Enter the assigned order number first.</strong><br><small>Live tracking is available after an order has been assigned to a rider.</small></div>`});let d=[...document.querySelectorAll(`[data-rider-panel]`)],f=[...document.querySelectorAll(`[data-rider-view]`)];d.forEach(e=>e.addEventListener(`click`,()=>{d.forEach(t=>t.classList.toggle(`active`,t===e)),f.forEach(t=>t.hidden=t.dataset.riderView!==e.dataset.riderPanel),document.querySelector(`.admin-view-stack`)?.scrollTo?.({top:0})}));let p=(t,n=`success`)=>e.innerHTML=`<div class="alert alert-${n}">${V(t)}</div>`,m=e=>e.distanceToShopKm===null?e.locationFresh?`Shop location unavailable`:`Location unavailable`:`${Number(e.distanceToShopKm).toFixed(1)} km away`,h=async()=>{try{let{data:e}=await z.get(`/admin/riders/applications`,B()),t=e.applications||[],n=t.filter(e=>![`approved`,`rejected`].includes(e.applicationStatus)).length,i=document.getElementById(`riderStatApplications`);i&&(i.textContent=n),r.innerHTML=t.map(e=>`<tr><td><strong>${V(e.fullName)}</strong><br><small>${V(e.phone)}</small></td><td>${V(e.vehicleType)}<br><small>${V(e.plateNumber)}</small></td><td>${V(e.email)}</td><td>${V(e.inspectionStatus)}</td><td>${V(e.applicationStatus)}</td><td><button class="btn btn-sm btn-dark review-application" data-id="${e.id}">Review</button></td></tr>`).join(``)||`<tr><td colspan="6">No rider applications yet.</td></tr>`,document.querySelectorAll(`.review-application`).forEach(e=>e.onclick=()=>g(e.dataset.id))}catch(e){r.innerHTML=`<tr><td colspan="6" class="text-danger">${V(e.response?.data?.message||`Unable to load applications.`)}</td></tr>`}},g=async e=>{try{let t=(await z.get(`/admin/riders/applications/${e}`,B())).data.application;i.innerHTML=`<div class="rider-review-overlay" role="dialog" aria-modal="true" aria-labelledby="riderReviewTitle"><div class="rider-review-dialog"><header class="rider-review-header"><div><span class="admin-eyebrow">Rider screening</span><h3 id="riderReviewTitle">${V(t.fullName)}</h3><p>${V(t.email)} · ${V(t.phone)}<br>${V(t.vehicleType)} · ${V(t.plateNumber)}</p></div><button class="btn-close" id="closeReview" aria-label="Close review"></button></header><div class="rider-review-body">${t.documentWarning?`<div class="alert alert-warning">A stored document could not be opened: ${V(t.documentWarning)}. Ask the rider to submit that document again.</div>`:``}<section class="rider-document-grid"><article><i class="bi bi-file-earmark-check"></i><div><strong>Proof of ownership</strong><small>Required document</small></div>${t.ownershipDocumentUrl?`<a class="btn btn-outline-light" href="${V(t.ownershipDocumentUrl)}" target="_blank" rel="noopener">Open document</a>`:`<span class="badge text-bg-danger">Unavailable</span>`}</article><article><i class="bi bi-person-vcard"></i><div><strong>Driving licence</strong><small>When applicable</small></div>${t.drivingLicenseUrl?`<a class="btn btn-outline-light" href="${V(t.drivingLicenseUrl)}" target="_blank" rel="noopener">Open document</a>`:`<span class="badge text-bg-secondary">Not supplied</span>`}</article></section><label class="form-label" for="decisionNotes">Admin review note</label><textarea id="decisionNotes" class="form-control" rows="4" placeholder="Reason or review note">${V(t.inspectionNotes||``)}</textarea><div class="alert alert-info mt-3"><strong>Pass rider</strong> creates a username and temporary password automatically and sends them to ${V(t.email)}.</div></div><footer class="rider-review-actions"><button id="rejectApplication" class="btn btn-outline-danger">Fail rider</button><button id="approveApplication" class="btn btn-success">Pass rider, create login &amp; email</button></footer></div></div>`,document.getElementById(`closeReview`).onclick=()=>i.innerHTML=``,document.getElementById(`approveApplication`).onclick=async t=>{t.currentTarget.disabled=!0;try{let t=(await z.post(`/admin/riders/applications/${e}/approve`,{notes:document.getElementById(`decisionNotes`).value},B())).data;p(`${t.message} Username: ${t.credentials.username}. Temporary password: ${t.credentials.temporaryPassword}.`,t.emailSent?`success`:`warning`),i.innerHTML=``,await _()}catch(e){p(e.response?.data?.message||`Unable to approve rider.`,`danger`),t.currentTarget.disabled=!1}},document.getElementById(`rejectApplication`).onclick=async()=>{let t=document.getElementById(`decisionNotes`).value||window.prompt(`Reason the rider failed:`)||``;await z.post(`/admin/riders/applications/${e}/reject`,{notes:t},B()),p(`Rider application marked as failed.`,`warning`),i.innerHTML=``,await h()}}catch(e){p(e.response?.data?.message||`Unable to open application.`,`danger`)}},_=async()=>{await h();try{let{data:e}=await z.get(`/admin/riders`,B()),n=e.riders||[],r=n.filter(e=>e.accountStatus===`active`),i=r.filter(e=>e.availabilityStatus===`available`),o=r.filter(e=>e.availabilityStatus===`busy`);[[`riderStatActive`,r.length],[`riderStatAvailable`,i.length],[`riderStatBusy`,o.length]].forEach(([e,t])=>{let n=document.getElementById(e);n&&(n.textContent=t)}),document.activeElement!==a&&(a.innerHTML=`<option value="">Select nearest available rider</option>`+i.map((e,t)=>`<option value="${e.id}">${t===0&&e.distanceToShopKm!==null?`Nearest — `:``}${V(e.fullName)} — ${V(m(e))}</option>`).join(``)),t.innerHTML=n.map((e,t)=>`<tr><td><strong>${V(e.fullName)}</strong><br><small>${V(e.username||e.phone)}</small></td><td>${V(e.vehicleType||`—`)}<br><small>${V(e.vehicleRegistrationNumber||``)}</small></td><td><span class="badge text-bg-${e.availabilityStatus===`available`?`success`:e.availabilityStatus===`busy`?`warning`:`secondary`}">${V(e.availabilityStatus)}</span></td><td>${t===0&&e.distanceToShopKm!==null?`<span class="badge text-bg-success me-1">Nearest</span>`:``}${V(m(e))}</td><td>${e.successfulDeliveries}/${e.totalDeliveries}</td><td>₦${Number(e.totalEarnings||0).toLocaleString()}</td><td><button class="btn btn-sm btn-outline-${e.accountStatus===`active`?`danger`:`success`} rider-status" data-id="${e.id}" data-status="${e.accountStatus===`active`?`inactive`:`active`}">${e.accountStatus===`active`?`Suspend`:`Activate`}</button></td></tr>`).join(``)||`<tr><td colspan="7">No riders onboarded yet.</td></tr>`,document.querySelectorAll(`.rider-status`).forEach(e=>e.onclick=async()=>{await z.patch(`/admin/riders/${e.dataset.id}/status`,{accountStatus:e.dataset.status},B()),await _()})}catch(e){t.innerHTML=`<tr><td colspan="7" class="text-danger">${V(e.response?.data?.message||`Unable to load riders.`)}</td></tr>`}},v=async()=>{let e=Number(c?.value);if(e)try{let{data:t}=await z.get(`/admin/orders/${e}/live-location`,B());l.innerHTML=n(t.tracking),t.tracking.active||(clearInterval(u),u=null)}catch(e){l.innerHTML=`<div class="alert alert-warning">${V(e.response?.data?.message||`Unable to load rider location.`)}</div>`}},y=e=>{e&&(c.value=e),clearInterval(u),v(),u=setInterval(()=>{document.hidden||v()},3e3)};s?.addEventListener(`submit`,e=>{e.preventDefault(),y()}),o?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(o));try{await z.post(`/admin/riders/assign/${t.orderId}`,{riderId:Number(t.riderId)},B()),p(`Delivery assigned. Live pickup tracking has started.`),y(t.orderId),o.reset(),await _()}catch(e){p(e.response?.data?.message||`Unable to assign delivery.`,`danger`)}}),document.getElementById(`refreshRiders`)?.addEventListener(`click`,_),window.addEventListener(`nutridust:admin-refresh`,e=>{e.detail?.view===`riders`&&_()}),await _()}var U=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),W=()=>({headers:{Authorization:`Bearer ${localStorage.getItem(`nutridust-admin-token`)}`}}),G=e=>String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]);function ye(){return`<section class="container-fluid px-lg-5 pb-5 admin-records-view admin-withdrawals-view"><div class="card border-0 shadow-sm admin-records-card"><div class="card-body"><div class="admin-records-header"><h2 class="h4">Rider withdrawals</h2><p class="text-secondary">Confirm payment only after completing the bank transfer.</p></div><div id="withdrawalMessage"></div><div class="table-responsive admin-records-scroll"><table class="table align-middle"><thead><tr><th>Rider</th><th>Bank</th><th>Amount</th><th>Status</th><th>Requested</th><th></th></tr></thead><tbody id="withdrawalRows"><tr><td colspan="6">Loading…</td></tr></tbody></table></div></div></div></section>`}async function be(){let e=document.getElementById(`withdrawalRows`),t=document.getElementById(`withdrawalMessage`),n=async()=>{try{let{data:r}=await U.get(`/admin/riders/withdrawals`,W()),i=(r.withdrawals||[]).map(e=>`<tr><td><strong>${G(e.riderName)}</strong><br><small>${G(e.phone)}</small></td><td>${G(e.bank_name)}<br><small>${G(e.account_name)} · ${G(e.account_number_masked)}</small></td><td>₦${Number(e.amount).toLocaleString()}</td><td><span class="badge text-bg-${e.status===`paid`?`success`:e.status===`rejected`?`danger`:`warning`}">${G(e.status)}</span></td><td>${new Date(e.created_at).toLocaleString()}</td><td>${e.status===`pending`?`<button class="btn btn-sm btn-success process-withdrawal" data-id="${e.id}" data-status="paid">Mark paid</button> <button class="btn btn-sm btn-outline-danger process-withdrawal" data-id="${e.id}" data-status="rejected">Reject</button>`:``}</td></tr>`).join(``)||`<tr><td colspan="6">No withdrawal requests.</td></tr>`;e.innerHTML!==i&&(e.innerHTML=i,document.querySelectorAll(`.process-withdrawal`).forEach(e=>e.onclick=async()=>{let r=window.prompt(e.dataset.status===`paid`?`Optional transfer reference or note`:`Reason for rejection`)||``;try{await U.patch(`/admin/riders/withdrawals/${e.dataset.id}`,{status:e.dataset.status,note:r},W()),await n()}catch(e){t.innerHTML=`<div class="alert alert-danger">${G(e.response?.data?.message||`Unable to process withdrawal.`)}</div>`}}))}catch(t){e.innerHTML=`<tr><td colspan="6" class="text-danger">${G(t.response?.data?.message||`Unable to load withdrawals.`)}</td></tr>`}};window.addEventListener(`nutridust:admin-refresh`,e=>{e.detail?.view===`withdrawals`&&n()}),await n()}var K=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),q=()=>({headers:{Authorization:`Bearer ${localStorage.getItem(`nutridust-admin-token`)}`}});function xe(){return`<section class="container-fluid px-lg-5 pb-4 admin-records-view admin-operations-view"><div class="card border-0 shadow-sm admin-records-card"><div class="card-body"><div class="d-flex justify-content-between align-items-center admin-records-header"><div><h2 class="h4 mb-1">Operations monitor</h2><p class="text-secondary mb-0">Automation handles routine work. Review only exceptions highlighted below.</p></div><button id="runOperationsNow" class="btn btn-dark"><i class="bi bi-lightning-charge me-1"></i> Run checks</button></div><div class="admin-records-scroll"><div id="operationsGrid" class="row g-3 mt-2"><div class="col-12 text-secondary">Loading operational status…</div></div><small id="operationsCheckedAt" class="text-secondary d-block mt-3"></small></div></div></div></section>`}async function Se(){let e=document.getElementById(`operationsGrid`),t=document.getElementById(`operationsCheckedAt`),n=document.getElementById(`runOperationsNow`);window.nutridustAdminCan?.(`operations.run`)||n?.remove();let r=async()=>{try{let{data:n}=await K.get(`/admin/operations`,q()),r=n.summary,i=[[`Low stock`,r.lowStock,`warning`],[`Out of stock`,r.outOfStock,`danger`],[`Awaiting rider`,r.deliveryOrdersAwaitingRider,`danger`],[`Pending payments`,r.pendingPayments,`warning`],[`Pickup ready`,r.pickupsReady,`info`],[`Withdrawals`,r.pendingWithdrawals,`warning`],[`Active deliveries`,r.activeDeliveries,`success`],[`Available riders`,r.availableRiders,`success`]].map(([e,t,n])=>`<div class="col-6 col-md-3"><div class="border rounded p-3 h-100"><small class="text-secondary">${e}</small><div class="display-6 fw-bold text-${Number(t)>0?n:`secondary`}">${t}</div></div></div>`).join(``);e.innerHTML!==i&&(e.innerHTML=i),t.textContent=`Last checked: ${new Date(n.lastCheckedAt).toLocaleString()}`}catch{e.innerHTML=`<div class="col-12 alert alert-danger">Unable to load operations monitor.</div>`}};n?.addEventListener(`click`,async e=>{e.currentTarget.disabled=!0;try{await K.post(`/admin/operations/run`,{},q()),await r()}finally{e.currentTarget.disabled=!1}}),window.addEventListener(`nutridust:admin-refresh`,e=>{e.detail?.view===`operations`&&r()}),await r()}var Ce=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),we=()=>({headers:{Authorization:`Bearer ${localStorage.getItem(`nutridust-admin-token`)}`}}),J=e=>String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]),Te=e=>{let t=Number(e.latitude),n=Number(e.longitude),r=.018,i=[n-r,t-r,n+r,t+r].join(`,`);return`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(i)}&layer=mapnik&marker=${encodeURIComponent(`${t},${n}`)}`},Ee=e=>({assigned:0,accepted:1,picked_up:2,out_for_delivery:3,delivered:4,failed:4})[e]??-1,De=[`Assigned`,`Going to pickup`,`Order collected`,`On delivery`,`Delivered`];function Oe(){return`<section class="admin-tracking-workspace">
 <header class="tracking-page-header"><div><span class="admin-eyebrow">Delivery control centre</span><h1>Live tracking</h1><p>Find an order and monitor its rider from assignment through delivery.</p></div><span class="tracking-connection-pill"><i></i> GPS updates every 3 seconds</span></header>
 <div class="tracking-search-card"><form id="trackingWorkspaceForm"><label for="trackingWorkspaceOrder">Order number</label><div><span class="tracking-search-prefix">#</span><input id="trackingWorkspaceOrder" type="number" min="1" placeholder="Enter order number" required><button type="submit"><i class="bi bi-crosshair"></i> Track order</button></div></form><p id="trackingWorkspaceMessage">Enter an assigned delivery order to begin.</p></div>
 <div class="tracking-stage-strip" id="trackingStageStrip">${De.map((e,t)=>`<div data-stage="${t}"><span>${t+1}</span><strong>${e}</strong></div>`).join(``)}</div>
 <div class="tracking-command-grid">
  <section class="tracking-map-panel"><div id="trackingMapCanvas" class="tracking-map-empty"><i class="bi bi-map"></i><strong>Live delivery map</strong><p>The rider marker will appear here after the Rider App shares its first GPS position.</p></div></section>
  <aside class="tracking-detail-panel" id="trackingDetailPanel"><div class="tracking-detail-empty"><i class="bi bi-bicycle"></i><h2>No order selected</h2><p>Search with the customer’s order number to see assignment, rider and GPS information.</p></div></aside>
 </div>
</section>`}function ke(){let e=document.getElementById(`trackingWorkspaceForm`),t=document.getElementById(`trackingWorkspaceOrder`),n=document.getElementById(`trackingWorkspaceMessage`),a=document.getElementById(`trackingMapCanvas`),o=document.getElementById(`trackingDetailPanel`),s=document.getElementById(`trackingStageStrip`);if(!e||!t||!a||!o)return;let c=null,l=null,u=e=>{let t=Ee(e);s.querySelectorAll(`[data-stage]`).forEach((e,n)=>{e.classList.toggle(`complete`,n<t),e.classList.toggle(`active`,n===t)})},d=e=>{u(e.deliveryStatus);let t=e.trackingAvailable&&e.location,s=Number.isFinite(Number(e.locationAgeSeconds))?`${e.locationAgeSeconds}s ago`:`Not received`,c=e.deliveryId?e.active?e.locationFresh?`live`:`delayed`:`complete`:`waiting`;n.textContent=`Order #${e.orderId} · ${e.phase}`,a.className=`tracking-map-panel-inner`,a.innerHTML=t?`<iframe title="Live rider position for order ${e.orderId}" src="${Te(e.location)}" loading="eager" referrerpolicy="no-referrer"></iframe><div class="tracking-map-status ${c}"><i></i>${e.locationFresh?`Live GPS`:`Location delayed`} · ${J(s)}</div>`:`<div class="tracking-map-empty"><i class="bi bi-geo-alt"></i><strong>${J(e.phase)}</strong><p>${e.deliveryId?`Waiting for the Rider App to send GPS. The rider must enable precise location and keep the app active.`:`This order has not been assigned to a rider.`}</p></div>`;let l=t?`<div class="tracking-navigation"><a href="${i(e.location)}" target="_blank" rel="noopener"><i class="bi bi-map"></i> Google Maps</a><a href="${r(e.location)}" target="_blank" rel="noopener"><i class="bi bi-navigation-fill"></i> Waze</a></div>`:``;o.innerHTML=`<div class="tracking-order-status ${c}"><span>${J(e.phase)}</span><small>Order #${e.orderId}</small></div>
   <div class="tracking-detail-group"><span>Assigned rider</span><strong>${J(e.rider?.name||`Not assigned`)}</strong><small>${J([e.rider?.vehicleType,e.rider?.vehicleRegistrationNumber].filter(Boolean).join(` · `)||`Waiting for assignment`)}</small></div>
   <div class="tracking-detail-group"><span>Delivery address</span><strong>${J(e.deliveryAddress||`Address unavailable`)}</strong></div>
   <div class="tracking-metrics"><div><span>GPS age</span><strong>${J(s)}</strong></div><div><span>Accuracy</span><strong>${e.location?.accuracy?`±${Math.round(e.location.accuracy)} m`:`—`}</strong></div></div>
   ${l}<div class="tracking-help"><i class="bi bi-info-circle"></i><p>${e.locationFresh?`The rider position is updating automatically from the Rider App.`:`If the rider is moving but the map is delayed, confirm phone Location is on and precise-location permission is allowed.`}</p></div>`},f=async()=>{if(l)try{let{data:e}=await Ce.get(`/admin/orders/${l}/live-location`,we());d(e.tracking),!e.tracking.active&&e.tracking.deliveryId&&(clearInterval(c),c=null)}catch(e){n.textContent=e.response?.data?.message||`Unable to load this order.`,a.innerHTML=`<div class="tracking-map-empty"><i class="bi bi-exclamation-triangle"></i><strong>Tracking unavailable</strong><p>Check the order number and try again.</p></div>`,o.innerHTML=`<div class="tracking-detail-empty"><p>No tracking information could be loaded.</p></div>`}},p=e=>{l=Number(e),clearInterval(c),f(),c=setInterval(()=>{document.hidden||f()},3e3)};e.addEventListener(`submit`,e=>{e.preventDefault(),p(t.value)}),window.addEventListener(`nutridust:admin-refresh`,e=>{e.detail?.view===`tracking`&&f()})}var Ae=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),Y=document.querySelector(`#app`),X={orders:`orders.view`,operations:`operations.view`,products:`products.view`,riders:`riders.view`,tracking:`riders.view`,withdrawals:`withdrawals.manage`,staff:`staff.manage`},Z=(e,t=u())=>t?.role===`admin`||t?.permissions?.includes(`*`)||t?.permissions?.includes(e),je=e=>String(e||`NA`).trim().split(/\s+/).slice(0,2).map(e=>e[0]||``).join(``).toUpperCase();window.nutridustAdminCan=e=>Z(e);function Q(){localStorage.removeItem(`nutridust-admin-token`),localStorage.removeItem(`nutridust-admin-user`),sessionStorage.removeItem(`nutridust-admin-token`),sessionStorage.removeItem(`nutridust-admin-user`)}function $(){Y.innerHTML=o(),Me()}function Me(){let e=document.getElementById(`adminLoginForm`),t=document.getElementById(`adminUsername`),n=document.getElementById(`adminPassword`),r=document.getElementById(`adminLoginButton`),i=document.getElementById(`adminLoginError`);if(!e){console.error(`❌ Admin login form not found.`);return}e.addEventListener(`submit`,async e=>{e.preventDefault();let a=t?.value?.trim()||``,o=n?.value||``;if(!a||!o){i&&(i.textContent=`Please enter your username and password.`,i.classList.remove(`d-none`));return}r.disabled=!0,r.innerHTML=`

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Logging in...

            `,i&&(i.classList.add(`d-none`),i.textContent=``);try{await c(a,o),console.log(`✅ Admin login successful.`),window.location.replace(`/admin.html`)}catch(e){console.error(`❌ Admin login error:`,e);let t=`Login failed. Please check your username and password.`;e.response&&e.response.data?t=e.response.data.message||t:e.message&&(t=e.message),i&&(i.textContent=t,i.classList.remove(`d-none`)),r.disabled=!1,r.innerHTML=`

                    <i
                        class="bi bi-box-arrow-in-right me-2"
                    ></i>

                    Login

                `}})}async function Ne(){let e=localStorage.getItem(`nutridust-admin-token`);if(!e)return!1;try{let t=await Ae.get(`/admin/session`,{headers:{Authorization:`Bearer ${e}`}});return t.status===200&&t.data?.admin?(localStorage.setItem(`nutridust-admin-user`,JSON.stringify(t.data.admin)),t.data.admin):null}catch(e){return console.error(`❌ Admin authentication check failed:`,e),e.response&&e.response.status===401?(Q(),!1):!0}}function Pe(e){let t=t=>Z(X[t],e),n=(e,n,r,i=!1)=>t(e)?`<button class="admin-task ${i?`active`:``}" data-admin-target="${e}" role="tab"><i class="bi ${n}"></i><span>${r}</span></button>`:``,r=(e,n)=>t(e)?`<div class="admin-view" data-admin-view="${e}" hidden>${n}</div>`:``,i=Object.keys(X).find(t);Y.innerHTML=`
        <div class="admin-workspace admin-v2">
            <nav class="admin-taskbar" aria-label="Admin tasks">
                <div class="admin-taskbar__brand"><span>NutriDust</span><small>${e?.role===`admin`?`Administrator`:e?.jobRole||`Staff`}</small></div>
                <div class="admin-nav-label">Workspace</div>
                <div class="admin-taskbar__items" role="tablist">
                    ${n(`orders`,`bi-receipt`,`Orders`,i===`orders`)}
                    ${n(`operations`,`bi-speedometer2`,`Overview`,i===`operations`)}
                    ${n(`products`,`bi-box-seam`,`Products & Stock`,i===`products`)}
                    ${n(`riders`,`bi-bicycle`,`Riders`,i===`riders`)}
                    ${n(`tracking`,`bi-geo-alt`,`Live Tracking`,i===`tracking`)}
                    ${n(`withdrawals`,`bi-wallet2`,`Withdrawals`,i===`withdrawals`)}
                    ${n(`staff`,`bi-people`,`Staff`,i===`staff`)}
                </div>
                <div class="admin-sidebar-spacer"></div>
                <div class="admin-help-card"><i class="bi bi-headset"></i><div><strong>Need help?</strong><small>Contact NutriDust support for assistance.</small></div></div>
                <button class="admin-sidebar-logout" id="workspaceLogout"><i class="bi bi-box-arrow-right"></i><span>Log out</span></button>
            </nav>
            <div class="admin-main-shell">
                <header class="admin-topbar"><div><span class="admin-topbar-kicker">NutriDust Foods</span><strong id="adminCurrentSection">Dashboard</strong></div><div class="admin-topbar-actions"><button id="adminGlobalSearch" type="button" aria-label="Search orders" title="Search orders"><i class="bi bi-search"></i></button><button id="adminNotifications" type="button" aria-label="Show pending notifications" title="Show pending orders"><i class="bi bi-bell"></i><span></span></button><div class="admin-profile-avatar">${je(e?.fullName||e?.username||`Admin`)}</div><div class="admin-profile-copy"><strong>${e?.fullName||e?.username||`NutriDust Admin`}</strong><small>${e?.role===`admin`?`Administrator`:e?.jobRole||`Staff`}</small></div></div></header>
                <main class="admin-view-stack">
                    ${r(`orders`,p())}
                    ${r(`operations`,xe())}
                    ${r(`products`,se())}
                    ${r(`riders`,ve())}
                    ${r(`tracking`,Oe())}
                    ${r(`withdrawals`,ye())}
                    ${r(`staff`,ge())}
                </main>
            </div>
        </div>

    `,document.querySelector(`[data-admin-view="${i}"]`)?.removeAttribute(`hidden`);let a=document.querySelector(`.admin-taskbar`);if(a){let e=()=>{let e=document.querySelector(`.admin-topbar`),t=window.innerWidth<=800?a.getBoundingClientRect().height:e?.getBoundingClientRect().height||72;document.documentElement.style.setProperty(`--admin-taskbar-height`,`${Math.ceil(t)}px`)};e(),new ResizeObserver(e).observe(a),window.addEventListener(`resize`,e,{passive:!0})}Fe(i);let o=()=>document.querySelector(`[data-admin-target="orders"]`)?.click();document.getElementById(`adminGlobalSearch`)?.addEventListener(`click`,()=>{o(),requestAnimationFrame(()=>{let e=document.getElementById(`orderSearch`);e?.focus(),e?.scrollIntoView({block:`nearest`})})}),document.getElementById(`adminNotifications`)?.addEventListener(`click`,()=>{o(),requestAnimationFrame(()=>{let e=document.getElementById(`paymentFilter`);e&&(e.value=`pending`,e.dispatchEvent(new Event(`change`,{bubbles:!0})),e.focus()),document.querySelector(`.admin-orders-list`)?.scrollIntoView({block:`nearest`})})}),document.getElementById(`workspaceLogout`)?.addEventListener(`click`,()=>{window.confirm(`Log out of the NutriDust admin dashboard?`)&&(Q(),$())})}function Fe(e=`orders`){let t=[...document.querySelectorAll(`[data-admin-target]`)],n=[...document.querySelectorAll(`[data-admin-view]`)],r=new Set(n.map(e=>e.dataset.adminView)),i={orders:`Orders`,operations:`Operations overview`,products:`Products & stock`,riders:`Rider management`,tracking:`Live tracking`,withdrawals:`Withdrawals`,staff:`Staff access`},a=a=>{let o=r.has(a)?a:e;n.forEach(e=>e.hidden=e.dataset.adminView!==o),t.forEach(e=>{let t=e.dataset.adminTarget===o;e.classList.toggle(`active`,t),e.setAttribute(`aria-selected`,String(t))}),location.hash!==`#${o}`&&history.replaceState(null,``,`#${o}`);let s=document.getElementById(`adminCurrentSection`);s&&(s.textContent=i[o]||`Dashboard`),window.scrollTo({top:0,behavior:`smooth`})};t.forEach(e=>e.addEventListener(`click`,()=>a(e.dataset.adminTarget))),window.addEventListener(`hashchange`,()=>a(location.hash.slice(1))),a(location.hash.slice(1)||e)}function Ie(){let e=!1;setInterval(async()=>{if(!(document.hidden||e||!s())){e=!0;try{let e=document.querySelector(`[data-admin-view]:not([hidden])`)?.dataset.adminView||`orders`;e===`orders`?await m():e===`products`?await D():window.dispatchEvent(new CustomEvent(`nutridust:admin-refresh`,{detail:{view:e}}))}catch{}finally{e=!1}}},3e3)}async function Le(){if(console.log(`🔐 Initializing NutriDust Admin...`),!s()){console.log(`ℹ️ No admin token found. Showing login.`),$();return}let e=await Ne();if(!e){console.log(`⚠️ Admin authentication failed.`),$();return}let t=e;Pe(t),Ie(),ae(),Z(`orders.view`,t)&&await m(),Z(`operations.view`,t)&&await Se(),Z(`orders.view`,t)&&(S(),oe()),Z(`orders.view`,t)&&C(),Z(`products.view`,t)&&me(),Z(`staff.manage`,t)&&await _e(),Z(`riders.view`,t)&&await H(),Z(`riders.view`,t)&&ke(),Z(`withdrawals.manage`,t)&&await be(),console.log(`✅ NutriDust Admin Dashboard initialized.`)}Le();