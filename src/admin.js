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
    setupAdminProducts
} from "./components/AdminProducts.js";

import {
    AdminLogin,
    loginAdmin,
    isAdminLoggedIn
} from "./components/AdminLogin.js";


// =====================================================
// API
// =====================================================

const API = axios.create({

    baseURL: "http://localhost:5000/api"

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

        ${AdminDashboard()}

        ${AdminProducts()}

    `;

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


    // -------------------------------------------------
    // LOGOUT
    // -------------------------------------------------

    setupAdminLogout();


    // -------------------------------------------------
    // ORDERS
    // -------------------------------------------------

    await loadAdminOrders();


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


    console.log(
        "✅ NutriDust Admin Dashboard initialized."
    );

}


// =====================================================
// START ADMIN
// =====================================================

initAdmin();