import logo from "../assets/logo/logo.png";
import * as bootstrap from "bootstrap";

import {
    getSavedCustomer,
    getCustomerToken,
    logoutCustomer
} from "../services/api.js";

import {
    getCustomerAvatar,
    removeCustomerAvatar
} from "./Auth.js";


// =====================================================
// CUSTOMER ACCOUNT NAVBAR
// =====================================================

export function Navbar() {

    const customer =
        getSavedCustomer();

    const token =
        getCustomerToken();

    const loggedIn =
        Boolean(
            token &&
            customer
        );


    // =================================================
    // CUSTOMER NAME
    // =================================================

    const customerName =
        customer?.name ||
        "Customer";


    // =================================================
    // CUSTOMER INITIAL
    // =================================================

    const customerInitial =
        customerName
            .charAt(0)
            .toUpperCase();


    // =================================================
    // CUSTOMER AVATAR
    // =================================================

    const avatar =
        getCustomerAvatar();


    // =================================================
    // AVATAR HTML
    // =================================================

    const avatarHTML =
        avatar

            ? `

                <img
                    src="${avatar}"
                    alt="${customerName}"
                    class="
                        rounded-circle
                        border
                        border-2
                    "
                    style="
                        width: 42px;
                        height: 42px;
                        object-fit: cover;
                    "
                >

            `

            : `

                <div
                    class="
                        rounded-circle
                        bg-warning
                        text-dark
                        fw-bold
                        d-flex
                        align-items-center
                        justify-content-center
                        border
                        border-2
                    "
                    style="
                        width: 42px;
                        height: 42px;
                    "
                >

                    ${customerInitial}

                </div>

            `;


    // =================================================
    // ACCOUNT AREA
    // =================================================

    const accountHTML =

        loggedIn

            ? `

                <!-- =========================================
                     LOGGED-IN CUSTOMER
                ========================================== -->

                <li class="nav-item dropdown ms-lg-3">

                    <a
                        class="
                            nav-link
                            dropdown-toggle
                            d-flex
                            align-items-center
                            gap-2
                        "
                        href="#"
                        id="customerAccountDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >

                        ${avatarHTML}

                        <span
                            class="
                                text-white
                                fw-semibold
                            "
                        >

                            ${customerName}

                        </span>

                    </a>


                    <ul
                        class="
                            dropdown-menu
                            dropdown-menu-end
                            shadow
                            border-0
                        "
                        aria-labelledby="customerAccountDropdown"
                    >

                        <!-- =================================
                             CUSTOMER PROFILE
                        ================================== -->

                        <li>

                            <a
                                class="dropdown-item"
                                href="#customer-profile"
                                id="customerProfileButton"
                            >

                                <i
                                    class="
                                        bi
                                        bi-person-circle
                                        me-2
                                    "
                                ></i>

                                My Profile

                            </a>

                        </li>


                        <!-- =================================
                             MY ORDERS
                        ================================== -->

                        <li>

                            <a
                                class="dropdown-item"
                                href="#track-order"
                                id="customerOrdersButton"
                            >

                                <i
                                    class="
                                        bi
                                        bi-box-seam
                                        me-2
                                    "
                                ></i>

                                My Orders

                            </a>

                        </li>


                        <li>
                            <hr class="dropdown-divider">
                        </li>


                        <!-- =================================
                             LOGOUT
                        ================================== -->

                        <li>

                            <button
                                type="button"
                                class="
                                    dropdown-item
                                    text-danger
                                "
                                id="customerLogoutButton"
                            >

                                <i
                                    class="
                                        bi
                                        bi-box-arrow-right
                                        me-2
                                    "
                                ></i>

                                Logout

                            </button>

                        </li>

                    </ul>

                </li>

            `

            : `

                <!-- =========================================
                     LOGGED-OUT CUSTOMER
                ========================================== -->

                <li class="nav-item ms-lg-3">

                    <button
                        type="button"
                        id="customerLoginButton"
                        class="
                            btn
                            btn-outline-warning
                            d-flex
                            align-items-center
                            gap-2
                        "
                    >

                        <i
                            class="
                                bi
                                bi-person-circle
                            "
                        ></i>

                        Login / Sign Up

                    </button>

                </li>

            `;


    // =================================================
    // RETURN NAVBAR
    // =================================================

    return `

<nav
    class="
        navbar
        navbar-expand-lg
        navbar-dark
        bg-dark
        shadow
        sticky-top
    "
>

    <div class="container">

        <!-- =============================================
             BRAND
        ============================================== -->

        <a
            class="
                navbar-brand
                d-flex
                align-items-center
            "
            href="#"
        >

            <img
                src="${logo}"
                alt="NutriDust Foods"
                class="navbar-logo me-3"
            >


            <div>

                <h2
                    class="
                        m-0
                        text-warning
                        fw-bold
                    "
                >

                    NutriDust Foods

                </h2>


                <small
                    class="
                        text-secondary
                    "
                >

                    Premium Nutrition

                </small>

            </div>

        </a>


        <!-- =============================================
             MOBILE MENU
        ============================================== -->

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >

            <span
                class="navbar-toggler-icon"
            ></span>

        </button>


        <!-- =============================================
             NAVIGATION
        ============================================== -->

        <div
            class="
                collapse
                navbar-collapse
            "
            id="navbarMenu"
        >

            <ul
                class="
                    navbar-nav
                    ms-auto
                    align-items-lg-center
                "
            >

                <!-- =====================================
                     HOME
                ====================================== -->

                <li class="nav-item">

                    <a
                        class="nav-link active"
                        href="#"
                    >

                        Home

                    </a>

                </li>


                <!-- =====================================
                     PRODUCTS
                ====================================== -->

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="#products"
                    >

                        Products

                    </a>

                </li>


                <!-- =====================================
                     NUTRITION
                ====================================== -->

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="#"
                    >

                        Nutrition

                    </a>

                </li>


                <!-- =====================================
                     RECIPES
                ====================================== -->

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="#"
                    >

                        Recipes

                    </a>

                </li>


                <!-- =====================================
                     CONTACT
                ====================================== -->

                <li class="nav-item">

                    <a
                        class="nav-link"
                        href="#"
                    >

                        Contact

                    </a>

                </li>


                <!-- =====================================
                     CART
                ====================================== -->

                <li
                    class="
                        nav-item
                        ms-lg-4
                    "
                >

                    <button
                        id="cartButton"
                        type="button"
                        class="
                            btn
                            btn-warning
                            position-relative
                        "
                    >

                        <i
                            class="
                                bi
                                bi-cart3
                                fs-4
                            "
                        ></i>


                        <span
                            id="cartCount"
                            class="
                                position-absolute
                                top-0
                                start-100
                                translate-middle
                                badge
                                rounded-pill
                                bg-danger
                            "
                        >

                            0

                        </span>

                    </button>

                </li>


                <!-- =====================================
                     CUSTOMER ACCOUNT
                ====================================== -->

                ${accountHTML}

            </ul>

        </div>

    </div>

</nav>

<nav class="customer-mobile-nav" aria-label="Customer app navigation">
    <a href="#" class="active" data-customer-mobile-tab="home"><i class="bi bi-house-door"></i><span>Home</span></a>
    <a href="#products" data-customer-mobile-tab="products"><i class="bi bi-grid"></i><span>Shop</span></a>
    <button type="button" id="mobileCartButton"><i class="bi bi-cart3"></i><span>Cart</span></button>
    <button type="button" id="mobileOrdersButton"><i class="bi bi-box-seam"></i><span>Orders</span></button>
    <button type="button" id="mobileAccountButton"><i class="bi bi-person"></i><span>Account</span></button>
</nav>

    `;

}


// =====================================================
// INITIALIZE NAVBAR ACCOUNT
// =====================================================

export function initNavbarAccount() {

    console.log(
        "👤 Initializing customer navbar..."
    );

    document.getElementById("mobileCartButton")?.addEventListener("click", () => {
        document.getElementById("cartButton")?.click();
    });

    document.getElementById("mobileOrdersButton")?.addEventListener("click", () => {
        if (document.getElementById("customerOrdersButton")) window.dispatchEvent(new CustomEvent("nutridust:open-orders"));
        else document.getElementById("customerLoginButton")?.click();
    });

    document.getElementById("mobileAccountButton")?.addEventListener("click", () => {
        const profileButton = document.getElementById("customerProfileButton");
        if (profileButton) profileButton.click();
        else document.getElementById("customerLoginButton")?.click();
    });

    document.querySelectorAll("[data-customer-mobile-tab]").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll("[data-customer-mobile-tab]").forEach(link => link.classList.remove("active"));
            item.classList.add("active");
        });
    });


    // =================================================
    // LOGIN BUTTON
    // =================================================

    const loginButton =
        document.getElementById(
            "customerLoginButton"
        );


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            () => {

                const authModalElement =
                    document.getElementById(
                        "customerAuthModal"
                    );


                if (!authModalElement) {

                    console.error(
                        "❌ Customer auth modal not found."
                    );

                    return;

                }


                const modal =
                    bootstrap.Modal
                        .getOrCreateInstance(
                            authModalElement
                        );


                modal.show();

            }
        );

    }


    // =================================================
    // LOGOUT BUTTON
    // =================================================

    const logoutButton =
        document.getElementById(
            "customerLogoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {

                    return;

                }


                logoutCustomer();


                removeCustomerAvatar();


                console.log(
                    "👋 Customer logged out."
                );


                window.location.reload();

            }
        );

    }


    // =================================================
    // PROFILE BUTTON
    // =================================================

    const profileButton =
        document.getElementById(
            "customerProfileButton"
        );


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const modal = document.getElementById("customerProfileModal");
                if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();

            }
        );

    }


    // =================================================
    // ORDERS BUTTON
    // =================================================

    const ordersButton =
        document.getElementById(
            "customerOrdersButton"
        );


    if (ordersButton) {

        ordersButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const modal = document.getElementById("customerOrdersModal");
                if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();

            }
        );

    }

    window.addEventListener("nutridust:open-orders", () => {
        const profileModal = document.getElementById("customerProfileModal");
        if (profileModal) bootstrap.Modal.getInstance(profileModal)?.hide();
        const ordersModal = document.getElementById("customerOrdersModal");
        if (ordersModal) bootstrap.Modal.getOrCreateInstance(ordersModal).show();
    });


    console.log(
        "✅ Customer navbar initialized."
    );

}
