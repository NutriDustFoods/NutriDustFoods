import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";

import axios from "axios";

import {
    AdminDashboard,
    loadAdminOrders,
    setupAdminFilters,
    setupAdminOrderStickyLayout,
    setupAdminRefresh,
    setupAdminLogout
} from "./components/AdminDashboard.js";

import {
    AdminProducts,
    setupAdminProducts,
    loadAdminProducts
} from "./components/AdminProducts.js";

import {
    AdminLogin,
    loginAdmin,
    isAdminLoggedIn,
    getAdminUser
} from "./components/AdminLogin.js";
import { AdminStaff, setupAdminStaff } from "./components/AdminStaff.js";
import { AdminRiders, setupAdminRiders } from "./components/AdminRiders.js";
import { AdminWithdrawals, setupAdminWithdrawals } from "./components/AdminWithdrawals.js";
import { AdminOperations, setupAdminOperations } from "./components/AdminOperations.js";


// =====================================================
// API
// =====================================================

const API = axios.create({

    baseURL: __API_URL__

});


// =====================================================
// APP
// =====================================================

const app =
    document.querySelector("#app");

const viewPermissions = {
    orders: "orders.view",
    operations: "operations.view",
    products: "products.view",
    riders: "riders.view",
    withdrawals: "withdrawals.manage",
    staff: "staff.manage"
};

const can = (permission, user = getAdminUser()) =>
    user?.role === "admin" || user?.permissions?.includes("*") || user?.permissions?.includes(permission);

window.nutridustAdminCan = permission => can(permission);


// =====================================================
// CLEAR ADMIN SESSION
// =====================================================

function clearAdminSession() {

    localStorage.removeItem(
        "nutridust-admin-token"
    );

    localStorage.removeItem(
        "nutridust-admin-user"
    );

    sessionStorage.removeItem(
        "nutridust-admin-token"
    );

    sessionStorage.removeItem(
        "nutridust-admin-user"
    );

}


// =====================================================
// SHOW LOGIN PAGE
// =====================================================

function showLoginPage() {

    app.innerHTML =
        AdminLogin();

    setupLoginForm();

}


// =====================================================
// LOGIN FORM
// =====================================================

function setupLoginForm() {

    const form =
        document.getElementById(
            "adminLoginForm"
        );


    const usernameInput =
        document.getElementById(
            "adminUsername"
        );


    const passwordInput =
        document.getElementById(
            "adminPassword"
        );


    const loginButton =
        document.getElementById(
            "adminLoginButton"
        );


    const errorBox =
        document.getElementById(
            "adminLoginError"
        );


    if (!form) {

        console.error(
            "❌ Admin login form not found."
        );

        return;

    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const username =
                usernameInput?.value?.trim() ||
                "";


            const password =
                passwordInput?.value ||
                "";


            if (!username || !password) {

                if (errorBox) {

                    errorBox.textContent =
                        "Please enter your username and password.";

                    errorBox.classList.remove(
                        "d-none"
                    );

                }

                return;

            }


            loginButton.disabled =
                true;


            loginButton.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Logging in...

            `;


            if (errorBox) {

                errorBox.classList.add(
                    "d-none"
                );

                errorBox.textContent =
                    "";

            }


            try {

                await loginAdmin(
                    username,
                    password
                );


                console.log(
                    "✅ Admin login successful."
                );


                window.location.replace(
                    "/admin.html"
                );


            } catch (error) {

                console.error(
                    "❌ Admin login error:",
                    error
                );


                let message =
                    "Login failed. Please check your username and password.";


                if (
                    error.response &&
                    error.response.data
                ) {

                    message =
                        error.response.data.message ||
                        message;

                } else if (
                    error.message
                ) {

                    message =
                        error.message;

                }


                if (errorBox) {

                    errorBox.textContent =
                        message;

                    errorBox.classList.remove(
                        "d-none"
                    );

                }


                loginButton.disabled =
                    false;


                loginButton.innerHTML = `

                    <i
                        class="bi bi-box-arrow-in-right me-2"
                    ></i>

                    Login

                `;

            }

        }
    );

}


// =====================================================
// VERIFY ADMIN TOKEN
// =====================================================

async function verifyAdminToken() {

    const token =
        localStorage.getItem(
            "nutridust-admin-token"
        );


    if (!token) {

        return false;

    }


    try {

        const response =
            await API.get(
                "/admin/session",
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        if (response.status === 200 && response.data?.admin) {
            localStorage.setItem("nutridust-admin-user", JSON.stringify(response.data.admin));
            return response.data.admin;
        }

        return null;


    } catch (error) {

        console.error(
            "❌ Admin authentication check failed:",
            error
        );


        if (
            error.response &&
            error.response.status === 401
        ) {

            clearAdminSession();

            return false;

        }


        return true;

    }

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showAdminDashboard(user) {

    const allowed = name => can(viewPermissions[name], user);
    const button = (name, icon, label, active = false) => allowed(name)
        ? `<button class="admin-task ${active ? "active" : ""}" data-admin-target="${name}" role="tab"><i class="bi ${icon}"></i><span>${label}</span></button>`
        : "";
    const view = (name, content) => allowed(name)
        ? `<div class="admin-view" data-admin-view="${name}" hidden>${content}</div>`
        : "";
    const firstView = Object.keys(viewPermissions).find(allowed);

    app.innerHTML = `
        <div class="admin-workspace">
            <nav class="admin-taskbar" aria-label="Admin tasks">
                <div class="admin-taskbar__brand"><span>NutriDust</span><small>${user?.role === "admin" ? "Administrator" : user?.jobRole || "Staff"}</small></div>
                <div class="admin-taskbar__items" role="tablist">
                    ${button("orders", "bi-receipt", "Orders", firstView === "orders")}
                    ${button("operations", "bi-speedometer2", "Overview", firstView === "operations")}
                    ${button("products", "bi-box-seam", "Products & Stock", firstView === "products")}
                    ${button("riders", "bi-bicycle", "Riders", firstView === "riders")}
                    ${button("withdrawals", "bi-wallet2", "Withdrawals", firstView === "withdrawals")}
                    ${button("staff", "bi-people", "Staff", firstView === "staff")}
                </div>
            </nav>
            <main class="admin-view-stack">
                ${view("orders", AdminDashboard())}
                ${view("operations", AdminOperations())}
                ${view("products", AdminProducts())}
                ${view("riders", AdminRiders())}
                ${view("withdrawals", AdminWithdrawals())}
                ${view("staff", AdminStaff())}
            </main>
        </div>

    `;

    document.querySelector(`[data-admin-view="${firstView}"]`)?.removeAttribute("hidden");
    const taskbar = document.querySelector(".admin-taskbar");
    if (taskbar) {
        const measureTaskbar = () => document.documentElement.style.setProperty(
            "--admin-taskbar-height",
            `${Math.ceil(taskbar.getBoundingClientRect().height)}px`
        );
        measureTaskbar();
        new ResizeObserver(measureTaskbar).observe(taskbar);
    }
    setupAdminWorkspaceNavigation(firstView);

}

function setupAdminWorkspaceNavigation(defaultView = "orders") {
    const buttons=[...document.querySelectorAll("[data-admin-target]")],views=[...document.querySelectorAll("[data-admin-view]")];
    const valid=new Set(views.map(view=>view.dataset.adminView));
    const show=name=>{
        const selected=valid.has(name)?name:defaultView;
        views.forEach(view=>view.hidden=view.dataset.adminView!==selected);
        buttons.forEach(button=>{const active=button.dataset.adminTarget===selected;button.classList.toggle("active",active);button.setAttribute("aria-selected",String(active));});
        if(location.hash!==`#${selected}`) history.replaceState(null,"",`#${selected}`);
        window.scrollTo({top:0,behavior:"smooth"});
    };
    buttons.forEach(button=>button.addEventListener("click",()=>show(button.dataset.adminTarget)));
    window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
    show(location.hash.slice(1)||defaultView);
}

function startSilentAdminRefresh() {
    let refreshing=false;
    setInterval(async()=>{
        if(document.hidden||refreshing||!isAdminLoggedIn())return;
        refreshing=true;
        try{
            const view=document.querySelector("[data-admin-view]:not([hidden])")?.dataset.adminView||"orders";
            if(view==="orders")await loadAdminOrders();
            else if(view==="products")await loadAdminProducts();
            else window.dispatchEvent(new CustomEvent("nutridust:admin-refresh",{detail:{view}}));
        }catch{}finally{refreshing=false;}
    },3000);
}


// =====================================================
// INITIALIZE ADMIN
// =====================================================

async function initAdmin() {

    console.log(
        "🔐 Initializing NutriDust Admin..."
    );


    // -------------------------------------------------
    // NO TOKEN
    // -------------------------------------------------

    if (!isAdminLoggedIn()) {

        console.log(
            "ℹ️ No admin token found. Showing login."
        );


        showLoginPage();


        return;

    }


    // -------------------------------------------------
    // VERIFY TOKEN
    // -------------------------------------------------

    const authenticated =
        await verifyAdminToken();


    if (!authenticated) {

        console.log(
            "⚠️ Admin authentication failed."
        );


        showLoginPage();


        return;

    }


    // -------------------------------------------------
    // SHOW DASHBOARD
    // -------------------------------------------------

    const user = authenticated;
    showAdminDashboard(user);
    startSilentAdminRefresh();


    // -------------------------------------------------
    // LOGOUT
    // -------------------------------------------------

    setupAdminLogout();


    // -------------------------------------------------
    // ORDERS
    // -------------------------------------------------

    if (can("orders.view", user)) await loadAdminOrders();
    if (can("operations.view", user)) await setupAdminOperations();


    // -------------------------------------------------
    // FILTERS
    // -------------------------------------------------

    if (can("orders.view", user)) {
        setupAdminFilters();
        setupAdminOrderStickyLayout();
    }


    // -------------------------------------------------
    // REFRESH
    // -------------------------------------------------

    if (can("orders.view", user)) setupAdminRefresh();


    // -------------------------------------------------
    // PRODUCTS
    // -------------------------------------------------

    if (can("products.view", user)) setupAdminProducts();
    if (can("staff.manage", user)) await setupAdminStaff();
    if (can("riders.view", user)) await setupAdminRiders();
    if (can("withdrawals.manage", user)) await setupAdminWithdrawals();


    console.log(
        "✅ NutriDust Admin Dashboard initialized."
    );

}


// =====================================================
// START ADMIN
// =====================================================

initAdmin();
