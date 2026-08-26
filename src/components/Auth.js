import * as bootstrap from "bootstrap";

import {
    loginCustomer,
    signupCustomer,
    getSavedCustomer
} from "../services/api.js";


// =====================================================
// CUSTOMER AVATAR STORAGE
// =====================================================

const CUSTOMER_AVATAR_KEY =
    "nutridust-customer-avatar";


// =====================================================
// GET CUSTOMER AVATAR
// =====================================================

export function getCustomerAvatar() {

    try {

        return localStorage.getItem(
            CUSTOMER_AVATAR_KEY
        );

    } catch (error) {

        console.error(
            "❌ Unable to read customer avatar:",
            error
        );

        return null;

    }

}


// =====================================================
// SAVE CUSTOMER AVATAR
// =====================================================

export function saveCustomerAvatar(
    avatar
) {

    if (!avatar) {

        return;

    }

    try {

        localStorage.setItem(
            CUSTOMER_AVATAR_KEY,
            avatar
        );

        console.log(
            "🖼️ Customer avatar saved."
        );

    } catch (error) {

        console.error(
            "❌ Unable to save customer avatar:",
            error
        );

    }

}


// =====================================================
// REMOVE CUSTOMER AVATAR
// =====================================================

export function removeCustomerAvatar() {

    try {

        localStorage.removeItem(
            CUSTOMER_AVATAR_KEY
        );

    } catch (error) {

        console.error(
            "❌ Unable to remove customer avatar:",
            error
        );

    }

}


// =====================================================
// CUSTOMER AUTH COMPONENT
// =====================================================

export function Auth() {

    return `

        <!-- =================================================
             CUSTOMER AUTH MODAL
        ================================================== -->

        <div
            class="modal fade"
            id="customerAuthModal"
            tabindex="-1"
            aria-hidden="true"
        >

            <div
                class="
                    modal-dialog
                    modal-dialog-centered
                "
            >

                <div class="modal-content">

                    <!-- =================================================
                         HEADER
                    ================================================== -->

                    <div class="modal-header">

                        <h5
                            class="modal-title"
                            id="customerAuthTitle"
                        >
                            Customer Login
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>

                    </div>


                    <!-- =================================================
                         BODY
                    ================================================== -->

                    <div class="modal-body">

                        <!-- =================================================
                             LOGIN FORM
                        ================================================== -->

                        <form
                            id="customerLoginForm"
                        >

                            <div class="mb-3">

                                <label
                                    for="customerLoginEmail"
                                    class="form-label fw-semibold"
                                >
                                    Email
                                </label>

                                <input
                                    type="email"
                                    class="form-control"
                                    id="customerLoginEmail"
                                    placeholder="Enter your email"
                                    autocomplete="email"
                                    required
                                >

                            </div>


                            <div class="mb-3">

                                <label
                                    for="customerLoginPassword"
                                    class="form-label fw-semibold"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    class="form-control"
                                    id="customerLoginPassword"
                                    placeholder="Enter your password"
                                    autocomplete="current-password"
                                    required
                                >

                            </div>


                            <div
                                id="customerLoginMessage"
                                class="mb-3"
                            ></div>


                            <button
                                type="submit"
                                id="customerSubmitLoginButton"
                                class="btn btn-dark w-100"
                            >

                                <i class="bi bi-box-arrow-in-right me-2"></i>

                                Login

                            </button>

                        </form>


                        <!-- =================================================
                             SIGNUP FORM
                        ================================================== -->

                        <form
                            id="customerSignupForm"
                            style="display: none;"
                        >

                            <!-- =================================================
                                 PROFILE PICTURE
                            ================================================== -->

                            <div class="text-center mb-4">

                                <div
                                    class="
                                        position-relative
                                        d-inline-block
                                    "
                                >

                                    <div
                                        id="customerAvatarPreview"
                                        class="
                                            rounded-circle
                                            overflow-hidden
                                            border
                                            border-3
                                            shadow-sm
                                            d-flex
                                            align-items-center
                                            justify-content-center
                                            bg-light
                                        "
                                        style="
                                            width: 100px;
                                            height: 100px;
                                        "
                                    >

                                        <i
                                            class="
                                                bi
                                                bi-person
                                                text-secondary
                                            "
                                            style="
                                                font-size: 3rem;
                                            "
                                        ></i>

                                    </div>


                                    <label
                                        for="customerSignupAvatar"
                                        class="
                                            position-absolute
                                            bottom-0
                                            end-0
                                            btn
                                            btn-dark
                                            rounded-circle
                                            d-flex
                                            align-items-center
                                            justify-content-center
                                            p-0
                                        "
                                        style="
                                            width: 34px;
                                            height: 34px;
                                            cursor: pointer;
                                        "
                                        title="Choose profile picture"
                                    >

                                        <i class="bi bi-camera"></i>

                                    </label>


                                    <input
                                        type="file"
                                        id="customerSignupAvatar"
                                        accept="image/*"
                                        style="display: none;"
                                    >

                                </div>


                                <div class="small text-muted mt-2">

                                    Add a profile picture

                                </div>

                            </div>


                            <!-- =================================================
                                 NAME
                            ================================================== -->

                            <div class="mb-3">

                                <label
                                    for="customerSignupName"
                                    class="form-label fw-semibold"
                                >
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    class="form-control"
                                    id="customerSignupName"
                                    placeholder="Enter your full name"
                                    autocomplete="name"
                                    required
                                >

                            </div>


                            <!-- =================================================
                                 EMAIL
                            ================================================== -->

                            <div class="mb-3">

                                <label
                                    for="customerSignupEmail"
                                    class="form-label fw-semibold"
                                >
                                    Email
                                </label>

                                <input
                                    type="email"
                                    class="form-control"
                                    id="customerSignupEmail"
                                    placeholder="Enter your email"
                                    autocomplete="email"
                                    required
                                >

                            </div>


                            <!-- =================================================
                                 PHONE
                            ================================================== -->

                            <div class="mb-3">

                                <label
                                    for="customerSignupPhone"
                                    class="form-label fw-semibold"
                                >
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    class="form-control"
                                    id="customerSignupPhone"
                                    placeholder="08012345678"
                                    autocomplete="tel"
                                    required
                                >

                            </div>


                            <!-- =================================================
                                 PASSWORD
                            ================================================== -->

                            <div class="mb-3">

                                <label
                                    for="customerSignupPassword"
                                    class="form-label fw-semibold"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    class="form-control"
                                    id="customerSignupPassword"
                                    placeholder="At least 6 characters"
                                    minlength="6"
                                    autocomplete="new-password"
                                    required
                                >

                            </div>


                            <!-- =================================================
                                 CONFIRM PASSWORD
                            ================================================== -->

                            <div class="mb-3">

                                <label
                                    for="customerSignupConfirmPassword"
                                    class="form-label fw-semibold"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    class="form-control"
                                    id="customerSignupConfirmPassword"
                                    placeholder="Re-enter your password"
                                    minlength="6"
                                    autocomplete="new-password"
                                    required
                                >

                            </div>


                            <div
                                id="customerSignupMessage"
                                class="mb-3"
                            ></div>


                            <button
                                type="submit"
                                id="customerSignupButton"
                                class="btn btn-dark w-100"
                            >

                                <i class="bi bi-person-plus me-2"></i>

                                Create Account

                            </button>

                        </form>


                        <!-- =================================================
                             SWITCH LOGIN / SIGNUP
                        ================================================== -->

                        <div class="text-center mt-4">

                            <a
                                href="#"
                                id="customerAuthSwitch"
                            >
                                Don't have an account? Sign Up
                            </a>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// INITIALIZE CUSTOMER AUTH
// =====================================================

export function initAuth() {

    console.log(
        "🔐 Initializing customer authentication..."
    );


    // =================================================
    // GET ELEMENTS
    // =================================================

    const modalElement =
        document.getElementById(
            "customerAuthModal"
        );

    const loginForm =
        document.getElementById(
            "customerLoginForm"
        );

    const signupForm =
        document.getElementById(
            "customerSignupForm"
        );

    const loginButton =
        document.getElementById(
            "customerSubmitLoginButton"
        );

    const signupButton =
        document.getElementById(
            "customerSignupButton"
        );

    const switchButton =
        document.getElementById(
            "customerAuthSwitch"
        );

    const title =
        document.getElementById(
            "customerAuthTitle"
        );

    const loginMessage =
        document.getElementById(
            "customerLoginMessage"
        );

    const signupMessage =
        document.getElementById(
            "customerSignupMessage"
        );

    const avatarInput =
        document.getElementById(
            "customerSignupAvatar"
        );

    const avatarPreview =
        document.getElementById(
            "customerAvatarPreview"
        );


    // =================================================
    // VALIDATE ELEMENTS
    // =================================================

    if (!modalElement) {

        console.error(
            "❌ customerAuthModal was not found."
        );

        return;

    }


    if (!loginForm || !signupForm) {

        console.error(
            "❌ Customer authentication forms were not found."
        );

        return;

    }


    console.log(
        "✅ Customer authentication elements found."
    );


    // =================================================
    // BOOTSTRAP MODAL
    // =================================================

    const modal =
        bootstrap.Modal
            .getOrCreateInstance(
                modalElement
            );


    // =================================================
    // AVATAR PREVIEW
    // =================================================

    if (avatarInput) {

        avatarInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files?.[0];

                if (!file) {

                    return;

                }


                // Only allow images.

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    signupMessage.innerHTML = `

                        <div class="alert alert-warning py-2">

                            Please select an image file.

                        </div>

                    `;

                    avatarInput.value = "";

                    return;

                }


                // Keep browser storage reasonable.

                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    signupMessage.innerHTML = `

                        <div class="alert alert-warning py-2">

                            Profile picture must be smaller than 5MB.

                        </div>

                    `;

                    avatarInput.value = "";

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    () => {

                        const image =
                            reader.result;

                        if (
                            avatarPreview
                        ) {

                            avatarPreview.innerHTML = `

                                <img
                                    src="${image}"
                                    alt="Profile preview"
                                    class="w-100 h-100"
                                    style="
                                        object-fit: cover;
                                    "
                                >

                            `;

                        }

                        // Store temporarily in browser.

                        avatarInput.dataset.avatar =
                            image;

                    };


                reader.onerror =
                    () => {

                        console.error(
                            "❌ Unable to read profile picture."
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    // =================================================
    // LOGIN
    // =================================================

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            console.log(
                "🔐 Customer login submitted."
            );


            const email =
                document
                    .getElementById(
                        "customerLoginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "customerLoginPassword"
                    )
                    .value;


            if (!email || !password) {

                loginMessage.innerHTML = `

                    <div class="alert alert-warning py-2">

                        Please enter your email and password.

                    </div>

                `;

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


            loginMessage.innerHTML =
                "";


            try {

                console.log(
                    "📡 Sending customer login request..."
                );


                const response =
                    await loginCustomer(
                        email,
                        password
                    );


                console.log(
                    "✅ Login response:",
                    response
                );


                if (
                    !response ||
                    !response.success ||
                    !response.token
                ) {

                    throw new Error(
                        response?.message ||
                        "Login failed."
                    );

                }


                console.log(
                    "🔐 JWT saved:",
                    Boolean(
                        localStorage.getItem(
                            "nutridust-customer-token"
                        )
                    )
                );


                console.log(
                    "👤 Customer saved:",
                    getSavedCustomer()
                );


                loginMessage.innerHTML = `

                    <div class="alert alert-success py-2">

                        <i class="bi bi-check-circle me-2"></i>

                        Login successful.

                    </div>

                `;


                // =================================================
                // CLOSE AND REFRESH
                // =================================================

                setTimeout(
                    () => {

                        modal.hide();

                        window.location.reload();

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "❌ Customer login error:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to login.";


                loginMessage.innerHTML = `

                    <div class="alert alert-danger py-2">

                        ${message}

                    </div>

                `;

            } finally {

                loginButton.disabled =
                    false;

                loginButton.innerHTML = `

                    <i class="bi bi-box-arrow-in-right me-2"></i>

                    Login

                `;

            }

        }
    );


    // =================================================
    // SIGNUP
    // =================================================

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            console.log(
                "📝 Customer signup submitted."
            );


            const name =
                document
                    .getElementById(
                        "customerSignupName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "customerSignupEmail"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerSignupPhone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "customerSignupPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "customerSignupConfirmPassword"
                    )
                    .value;


            // =================================================
            // VALIDATE PASSWORD
            // =================================================

            if (
                password.length < 6
            ) {

                signupMessage.innerHTML = `

                    <div class="alert alert-warning py-2">

                        Password must be at least 6 characters.

                    </div>

                `;

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                signupMessage.innerHTML = `

                    <div class="alert alert-danger py-2">

                        Passwords do not match.

                    </div>

                `;

                return;

            }


            signupButton.disabled =
                true;


            signupButton.innerHTML = `

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Creating Account...

            `;


            signupMessage.innerHTML =
                "";


            try {

                // =================================================
                // CREATE ACCOUNT
                // =================================================

                const response =
                    await signupCustomer({

                        name,

                        email,

                        phone,

                        password

                    });


                console.log(
                    "✅ Signup response:",
                    response
                );


                if (
                    !response ||
                    !response.success
                ) {

                    throw new Error(
                        response?.message ||
                        "Unable to create account."
                    );

                }


                // =================================================
                // SAVE AVATAR LOCALLY
                // =================================================

                const avatar =
                    avatarInput?.dataset?.avatar;


                if (avatar) {

                    saveCustomerAvatar(
                        avatar
                    );

                }


                signupMessage.innerHTML = `

                    <div class="alert alert-success py-2">

                        <i class="bi bi-check-circle me-2"></i>

                        Account created successfully.

                    </div>

                `;


                // =================================================
                // BACKEND RETURNED TOKEN
                // =================================================

                if (
                    response.token
                ) {

                    console.log(
                        "🔐 Signup JWT saved."
                    );


                    setTimeout(
                        () => {

                            modal.hide();

                            window.location.reload();

                        },
                        700
                    );


                    return;

                }


                // =================================================
                // NO TOKEN
                // SWITCH TO LOGIN
                // =================================================

                setTimeout(
                    () => {

                        switchToLogin();

                    },
                    900
                );


            } catch (error) {

                console.error(
                    "❌ Customer signup error:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to create account.";


                signupMessage.innerHTML = `

                    <div class="alert alert-danger py-2">

                        ${message}

                    </div>

                `;

            } finally {

                signupButton.disabled =
                    false;

                signupButton.innerHTML = `

                    <i class="bi bi-person-plus me-2"></i>

                    Create Account

                `;

            }

        }
    );


    // =================================================
    // SWITCH TO SIGNUP
    // =================================================

    const switchToSignup = () => {

        loginForm.style.display =
            "none";


        signupForm.style.display =
            "block";


        title.textContent =
            "Create Customer Account";


        switchButton.textContent =
            "Already have an account? Login";


        loginMessage.innerHTML =
            "";


        signupMessage.innerHTML =
            "";

    };


    // =================================================
    // SWITCH TO LOGIN
    // =================================================

    const switchToLogin = () => {

        signupForm.style.display =
            "none";


        loginForm.style.display =
            "block";


        title.textContent =
            "Customer Login";


        switchButton.textContent =
            "Don't have an account? Sign Up";


        loginMessage.innerHTML =
            "";


        signupMessage.innerHTML =
            "";

    };


    // =================================================
    // SWITCH BUTTON
    // =================================================

    switchButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (
                loginForm.style.display !==
                "none"
            ) {

                switchToSignup();

            } else {

                switchToLogin();

            }

        }
    );


    console.log(
        "✅ Customer authentication initialized."
    );

}


// =====================================================
// SHOW CUSTOMER LOGIN
// =====================================================

export function showCustomerLogin() {

    const modalElement =
        document.getElementById(
            "customerAuthModal"
        );


    if (!modalElement) {

        console.error(
            "❌ Customer auth modal not found."
        );

        return;

    }


    const modal =
        bootstrap.Modal
            .getOrCreateInstance(
                modalElement
            );


    modal.show();

}
