import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";


import {
    AdminDashboard,
    loadAdminOrders,
    setupAdminFilters,
    setupAdminRefresh
} from "./components/AdminDashboard.js";

import {
    AdminProducts,
    setupAdminProducts
} from "./components/AdminProducts.js";


// =====================================================
// ADMIN PAGE
// =====================================================

document.querySelector("#app").innerHTML = `

    ${AdminDashboard()}

    ${AdminProducts()}
`;


// =====================================================
// INITIALIZE
// =====================================================

async function initAdmin() {

    await loadAdminOrders();

    setupAdminFilters();

    setupAdminRefresh();

    setupAdminProducts();

}


initAdmin();