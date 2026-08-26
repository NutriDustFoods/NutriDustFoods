import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";

import axios from "axios";

import {
    AdminDashboard,
    loadAdminOrders,
    setupAdminFilters,
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
    isAdminLoggedIn
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
                "/admin/orders",
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        return (
            response.status === 200
        );


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

function showAdminDashboard() {

    app.innerHTML = `
        <div class="admin-workspace">
            <nav class="admin-taskbar" aria-label="Admin tasks">
                <div class="admin-taskbar__brand"><span>NutriDust</span><small>Operations</small></div>
                <div class="admin-taskbar__items" role="tablist">
                    <button class="admin-task active" data-admin-target="orders" role="tab"><i class="bi bi-receipt"></i><span>Orders</span></button>
                    <button class="admin-task" data-admin-target="operations" role="tab"><i class="bi bi-speedometer2"></i><span>Overview</span></button>
                    <button class="admin-task" data-admin-target="products" role="tab"><i class="bi bi-box-seam"></i><span>Products &amp; Stock</span></button>
                    <button class="admin-task" data-admin-target="riders" role="tab"><i class="bi bi-bicycle"></i><span>Riders</span></button>
                    <button class="admin-task" data-admin-target="withdrawals" role="tab"><i class="bi bi-wallet2"></i><span>Withdrawals</span></button>
                    <button class="admin-task" data-admin-target="staff" role="tab"><i class="bi bi-people"></i><span>Staff</span></button>
                </div>
            </nav>
            <main class="admin-view-stack">
                <div class="admin-view" data-admin-view="orders">${AdminDashboard()}</div>
                <div class="admin-view" data-admin-view="operations" hidden>${AdminOperations()}</div>
                <div class="admin-view" data-admin-view="products" hidden>${AdminProducts()}</div>
                <div class="admin-view" data-admin-view="riders" hidden>${AdminRiders()}</div>
                <div class="admin-view" data-admin-view="withdrawals" hidden>${AdminWithdrawals()}</div>
                <div class="admin-view" data-admin-view="staff" hidden>${AdminStaff()}</div>
            </main>
        </div>

    `;

    setupAdminWorkspaceNavigation();

}

function setupAdminWorkspaceNavigation() {
    const buttons=[...document.querySelectorAll("[data-admin-target]")],views=[...document.querySelectorAll("[data-admin-view]")];
    const valid=new Set(views.map(view=>view.dataset.adminView));
    const show=name=>{
        const selected=valid.has(name)?name:"orders";
        views.forEach(view=>view.hidden=view.dataset.adminView!==selected);
        buttons.forEach(button=>{const active=button.dataset.adminTarget===selected;button.classList.toggle("active",active);button.setAttribute("aria-selected",String(active));});
        if(location.hash!==`#${selected}`) history.replaceState(null,"",`#${selected}`);
        window.scrollTo({top:0,behavior:"smooth"});
    };
    buttons.forEach(button=>button.addEventListener("click",()=>show(button.dataset.adminTarget)));
    window.addEventListener("hashchange",()=>show(location.hash.slice(1)));
    show(location.hash.slice(1)||"orders");
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

    showAdminDashboard();
    startSilentAdminRefresh();


    // -------------------------------------------------
    // LOGOUT
    // -------------------------------------------------

    setupAdminLogout();


    // -------------------------------------------------
    // ORDERS
    // -------------------------------------------------

    await loadAdminOrders();
    await setupAdminOperations();


    // -------------------------------------------------
    // FILTERS
    // -------------------------------------------------

    setupAdminFilters();


    // -------------------------------------------------
    // REFRESH
    // -------------------------------------------------

    setupAdminRefresh();


    // -------------------------------------------------
    // PRODUCTS
    // -------------------------------------------------

    setupAdminProducts();
    await setupAdminStaff();
    await setupAdminRiders();
    await setupAdminWithdrawals();


    console.log(
        "✅ NutriDust Admin Dashboard initialized."
    );

}


// =====================================================
// START ADMIN
// =====================================================

initAdmin();
