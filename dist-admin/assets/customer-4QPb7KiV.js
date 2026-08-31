import{t as e}from"./axios-_aN4D4J9.js";import{a as t,i as n,n as r}from"./liveTrackingMap-LZgxnnmp.js";var i=`/assets/logo-wRHrwKOg.png`,a=e.create({baseURL:`https://nutridustfoods.onrender.com/api`}),o=`nutridust-customer-token`,s=`nutridust-customer`,c=()=>localStorage.getItem(o),l=()=>{let e=localStorage.getItem(s);if(!e)return null;try{return JSON.parse(e)}catch(e){return console.error(`❌ Invalid saved customer data:`,e),null}},u=e=>{e?.token&&localStorage.setItem(o,e.token),e?.customer&&localStorage.setItem(s,JSON.stringify(e.customer))},d=()=>{localStorage.removeItem(o),localStorage.removeItem(s),console.log(`👋 Customer logged out.`)};a.interceptors.request.use(e=>{let t=c();return t&&(e.headers=e.headers||{},e.headers.Authorization=`Bearer ${t}`),e},e=>Promise.reject(e)),a.interceptors.response.use(e=>e,e=>(e?.response?.status===401&&(console.warn(`🔐 Customer authentication expired or is invalid.`),d()),Promise.reject(e)));var f=async e=>{let{data:t}=await a.post(`/auth/signup`,e);return t?.success&&t?.token&&u(t),t},ee=async(e,t)=>{let{data:n}=await a.post(`/auth/login`,{email:e,password:t});return n?.success&&n?.token&&u(n),n},p=async()=>{let{data:e}=await a.get(`/auth/me`);return e?.success&&e?.customer&&localStorage.setItem(s,JSON.stringify(e.customer)),e},m=async()=>{let{data:e}=await a.get(`/products`);return e},h=async e=>{let t={deliveryAddress:e?.deliveryAddress||``,fulfillmentType:e?.fulfillmentType||`delivery`,items:Array.isArray(e?.items)?e.items:[]},{data:n}=await a.post(`/orders`,t);return n},g=async e=>{let{data:t}=await a.post(`/orders/delivery-quote`,{deliveryAddress:e});return t.quote},_=async()=>{let{data:e}=await a.get(`/orders/my`);return e},te=async e=>{if(!e)throw Error(`Order number is required.`);let{data:t}=await a.get(`/orders/${encodeURIComponent(e)}/live-location`);return t},ne=async e=>{let{data:t}=await a.post(`/payments/initialize`,{orderId:e});return t},re=async e=>{let{data:t}=await a.get(`/payments/verify/${encodeURIComponent(e)}`);return t},v=async e=>{if(!e)throw Error(`Order number is required.`);let{data:t}=await a.get(`/orders/${encodeURIComponent(e)}`);return t},y=`nutridust-customer-avatar`;function ie(){try{return localStorage.getItem(y)}catch(e){return console.error(`❌ Unable to read customer avatar:`,e),null}}function ae(e){if(e)try{localStorage.setItem(y,e),console.log(`🖼️ Customer avatar saved.`)}catch(e){console.error(`❌ Unable to save customer avatar:`,e)}}function oe(){try{localStorage.removeItem(y)}catch(e){console.error(`❌ Unable to remove customer avatar:`,e)}}function se(){return`

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

    `}function ce(){console.log(`🔐 Initializing customer authentication...`);let e=document.getElementById(`customerAuthModal`),t=document.getElementById(`customerLoginForm`),r=document.getElementById(`customerSignupForm`),i=document.getElementById(`customerSubmitLoginButton`),a=document.getElementById(`customerSignupButton`),o=document.getElementById(`customerAuthSwitch`),s=document.getElementById(`customerAuthTitle`),c=document.getElementById(`customerLoginMessage`),u=document.getElementById(`customerSignupMessage`),d=document.getElementById(`customerSignupAvatar`),p=document.getElementById(`customerAvatarPreview`);if(!e){console.error(`❌ customerAuthModal was not found.`);return}if(!t||!r){console.error(`❌ Customer authentication forms were not found.`);return}console.log(`✅ Customer authentication elements found.`);let m=n.getOrCreateInstance(e);d&&d.addEventListener(`change`,e=>{let t=e.target.files?.[0];if(!t)return;if(!t.type.startsWith(`image/`)){u.innerHTML=`

                        <div class="alert alert-warning py-2">

                            Please select an image file.

                        </div>

                    `,d.value=``;return}if(t.size>5242880){u.innerHTML=`

                        <div class="alert alert-warning py-2">

                            Profile picture must be smaller than 5MB.

                        </div>

                    `,d.value=``;return}let n=new FileReader;n.onload=()=>{let e=n.result;p&&(p.innerHTML=`

                                <img
                                    src="${e}"
                                    alt="Profile preview"
                                    class="w-100 h-100"
                                    style="
                                        object-fit: cover;
                                    "
                                >

                            `),d.dataset.avatar=e},n.onerror=()=>{console.error(`❌ Unable to read profile picture.`)},n.readAsDataURL(t)}),t.addEventListener(`submit`,async e=>{e.preventDefault(),console.log(`🔐 Customer login submitted.`);let t=document.getElementById(`customerLoginEmail`).value.trim(),n=document.getElementById(`customerLoginPassword`).value;if(!t||!n){c.innerHTML=`

                    <div class="alert alert-warning py-2">

                        Please enter your email and password.

                    </div>

                `;return}i.disabled=!0,i.innerHTML=`

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Logging in...

            `,c.innerHTML=``;try{console.log(`📡 Sending customer login request...`);let e=await ee(t,n);if(console.log(`✅ Login response:`,e),!e||!e.success||!e.token)throw Error(e?.message||`Login failed.`);console.log(`🔐 JWT saved:`,!!localStorage.getItem(`nutridust-customer-token`)),console.log(`👤 Customer saved:`,l()),c.innerHTML=`

                    <div class="alert alert-success py-2">

                        <i class="bi bi-check-circle me-2"></i>

                        Login successful.

                    </div>

                `,setTimeout(()=>{m.hide(),window.location.reload()},500)}catch(e){console.error(`❌ Customer login error:`,e);let t=e?.response?.data?.message||e?.message||`Unable to login.`;c.innerHTML=`

                    <div class="alert alert-danger py-2">

                        ${t}

                    </div>

                `}finally{i.disabled=!1,i.innerHTML=`

                    <i class="bi bi-box-arrow-in-right me-2"></i>

                    Login

                `}}),r.addEventListener(`submit`,async e=>{e.preventDefault(),console.log(`📝 Customer signup submitted.`);let t=document.getElementById(`customerSignupName`).value.trim(),n=document.getElementById(`customerSignupEmail`).value.trim(),r=document.getElementById(`customerSignupPhone`).value.trim(),i=document.getElementById(`customerSignupPassword`).value,o=document.getElementById(`customerSignupConfirmPassword`).value;if(i.length<6){u.innerHTML=`

                    <div class="alert alert-warning py-2">

                        Password must be at least 6 characters.

                    </div>

                `;return}if(i!==o){u.innerHTML=`

                    <div class="alert alert-danger py-2">

                        Passwords do not match.

                    </div>

                `;return}a.disabled=!0,a.innerHTML=`

                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>

                Creating Account...

            `,u.innerHTML=``;try{let e=await f({name:t,email:n,phone:r,password:i});if(console.log(`✅ Signup response:`,e),!e||!e.success)throw Error(e?.message||`Unable to create account.`);let a=d?.dataset?.avatar;if(a&&ae(a),u.innerHTML=`

                    <div class="alert alert-success py-2">

                        <i class="bi bi-check-circle me-2"></i>

                        Account created successfully.

                    </div>

                `,e.token){console.log(`🔐 Signup JWT saved.`),setTimeout(()=>{m.hide(),window.location.reload()},700);return}setTimeout(()=>{g()},900)}catch(e){console.error(`❌ Customer signup error:`,e);let t=e?.response?.data?.message||e?.message||`Unable to create account.`;u.innerHTML=`

                    <div class="alert alert-danger py-2">

                        ${t}

                    </div>

                `}finally{a.disabled=!1,a.innerHTML=`

                    <i class="bi bi-person-plus me-2"></i>

                    Create Account

                `}});let h=()=>{t.style.display=`none`,r.style.display=`block`,s.textContent=`Create Customer Account`,o.textContent=`Already have an account? Login`,c.innerHTML=``,u.innerHTML=``},g=()=>{r.style.display=`none`,t.style.display=`block`,s.textContent=`Customer Login`,o.textContent=`Don't have an account? Sign Up`,c.innerHTML=``,u.innerHTML=``};o.addEventListener(`click`,e=>{e.preventDefault(),t.style.display===`none`?g():h()}),console.log(`✅ Customer authentication initialized.`)}function le(){let e=l(),t=!!(c()&&e),n=e?.name||`Customer`,r=n.charAt(0).toUpperCase(),a=ie(),o=a?`

                <img
                    src="${a}"
                    alt="${n}"
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

            `:`

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

                    ${r}

                </div>

            `;return`

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
                src="${i}"
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

                ${t?`

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

                        ${o}

                        <span
                            class="
                                text-white
                                fw-semibold
                            "
                        >

                            ${n}

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

            `:`

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

            `}

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

    `}function ue(){console.log(`👤 Initializing customer navbar...`),document.getElementById(`mobileCartButton`)?.addEventListener(`click`,()=>{document.getElementById(`cartButton`)?.click()}),document.getElementById(`mobileOrdersButton`)?.addEventListener(`click`,()=>{document.getElementById(`customerOrdersButton`)?window.dispatchEvent(new CustomEvent(`nutridust:open-orders`)):document.getElementById(`customerLoginButton`)?.click()}),document.getElementById(`mobileAccountButton`)?.addEventListener(`click`,()=>{let e=document.getElementById(`customerProfileButton`);e?e.click():document.getElementById(`customerLoginButton`)?.click()}),document.querySelectorAll(`[data-customer-mobile-tab]`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`[data-customer-mobile-tab]`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)})});let e=document.getElementById(`customerLoginButton`);e&&e.addEventListener(`click`,()=>{let e=document.getElementById(`customerAuthModal`);if(!e){console.error(`❌ Customer auth modal not found.`);return}n.getOrCreateInstance(e).show()});let t=document.getElementById(`customerLogoutButton`);t&&t.addEventListener(`click`,()=>{window.confirm(`Are you sure you want to logout?`)&&(d(),oe(),console.log(`👋 Customer logged out.`),window.location.reload())});let r=document.getElementById(`customerProfileButton`);r&&r.addEventListener(`click`,e=>{e.preventDefault();let t=document.getElementById(`customerProfileModal`);t&&n.getOrCreateInstance(t).show()});let i=document.getElementById(`customerOrdersButton`);i&&i.addEventListener(`click`,e=>{e.preventDefault();let t=document.getElementById(`customerOrdersModal`);t&&n.getOrCreateInstance(t).show()}),window.addEventListener(`nutridust:open-orders`,()=>{let e=document.getElementById(`customerProfileModal`);e&&n.getInstance(e)?.hide();let t=document.getElementById(`customerOrdersModal`);t&&n.getOrCreateInstance(t).show()}),console.log(`✅ Customer navbar initialized.`)}function de(){return`

<section class="hero d-flex align-items-center">

<div class="container">

<div class="row align-items-center">

<div class="col-lg-7">

<p class="hero-small">

AFRICA'S PREMIUM NUTRITION BRAND

</p>

<h1>

Naturally Nutritious.

<br>

Premium Quality.

</h1>

<p class="hero-text">

Premium Jerky • Fruit Powders • Baby Foods • Healthy Snacks

</p>

<a href="#products" class="btn btn-warning btn-lg">
    Explore Our Products
</a>

</div>

</div>

</div>

</section>

`}function fe(){return`

<section class="py-5 bg-dark">

<div class="container">

<div class="text-center mb-5">

<h2 class="display-5 fw-bold text-warning">

Why Choose NutriDust Foods?

</h2>

<p class="text-light">

Premium nutrition crafted with quality, safety, and taste in mind.

</p>

</div>

<div class="row g-4">

<div class="col-md-3">

<div class="card h-100 bg-black border-warning text-center p-4">

<i class="bi bi-shield-check text-warning display-3"></i>

<h4 class="mt-3 text-warning">

Premium Quality

</h4>

<p class="text-light">

Carefully selected ingredients processed under strict quality standards.

</p>

</div>

</div>

<div class="col-md-3">

<div class="card h-100 bg-black border-warning text-center p-4">

<i class="bi bi-heart-pulse text-warning display-3"></i>

<h4 class="mt-3 text-warning">

Healthy Living

</h4>

<p class="text-light">

Nutritious foods rich in protein, vitamins and essential minerals.

</p>

</div>

</div>

<div class="col-md-3">

<div class="card h-100 bg-black border-warning text-center p-4">

<i class="bi bi-award text-warning display-3"></i>

<h4 class="mt-3 text-warning">

Trusted Brand

</h4>

<p class="text-light">

Built on quality, consistency, and customer satisfaction.

</p>

</div>

</div>

<div class="col-md-3">

<div class="card h-100 bg-black border-warning text-center p-4">

<i class="bi bi-globe-africa text-warning display-3"></i>

<h4 class="mt-3 text-warning">

Made in Africa

</h4>

<p class="text-light">

Proudly producing premium nutrition for Africa and the global market.

</p>

</div>

</div>

</div>

</div>

</section>

`}function pe(e){let t=``;for(let n=1;n<=5;n++)t+=n<=e?`<i class="bi bi-star-fill text-warning"></i>`:`<i class="bi bi-star text-warning"></i>`;return t}var me=`https://nutridustfoods.onrender.com`;function he(e){return e?e.startsWith(`http://`)||e.startsWith(`https://`)?e:`${me}${e}`:``}function b(e){let t=Number(e.quantityAvailable??0);return t<=0?`

            <div
                class="alert alert-danger py-2 px-3 mb-3"
            >

                <i class="bi bi-x-circle-fill me-1"></i>

                <strong>
                    Out of Stock
                </strong>

            </div>

        `:t<=5?`

            <div
                class="alert alert-danger py-2 px-3 mb-3"
            >

                <i class="bi bi-exclamation-triangle-fill me-1"></i>

                <strong>
                    Only ${t.toLocaleString()} left!
                </strong>

            </div>

        `:t<=Number(e.lowStockThreshold??10)?`

            <div
                class="alert alert-warning py-2 px-3 mb-3"
            >

                <i class="bi bi-exclamation-circle-fill me-1"></i>

                <strong>
                    Only ${t.toLocaleString()} left
                </strong>

            </div>

        `:`

        <div
            class="text-success fw-semibold mb-3"
        >

            <i class="bi bi-check-circle-fill me-1"></i>

            ${t.toLocaleString()} available

        </div>

    `}async function x(){let e=await m();return console.log(`Customer products:`,e),`

        <section
            id="products"
            class="products py-5"
        >

            <div class="container">


                <!-- SECTION HEADER -->

                <div
                    class="text-center mb-5"
                >

                    <h2
                        class="display-4 fw-bold text-warning"
                    >

                        Featured Products

                    </h2>


                    <p class="text-light">

                        Explore our premium range
                        of nutritious products.

                    </p>

                </div>


                <!-- PRODUCTS -->

                <div class="row g-4">

                    ${e.map(e=>{let t=he(e.image),n=Number(e.quantityAvailable??0)<=0;return`

                <div class="col-lg-4 col-md-6">

                    <div class="card product-card h-100" data-product-card="${e.id}">

                        <!-- ================================================= -->
                        <!-- IMAGE -->
                        <!-- ================================================= -->

                        <div class="position-relative">

                            ${t?`

                                        <img
                                            src="${t}"
                                            class="card-img-top"
                                            alt="${e.name}"
                                            style="
                                                width:100%;
                                                height:280px;
                                                object-fit:cover;
                                            "
                                        >

                                    `:`

                                        <div
                                            class="d-flex align-items-center justify-content-center bg-light"
                                            style="
                                                width:100%;
                                                height:280px;
                                            "
                                        >

                                            <i
                                                class="bi bi-image text-muted"
                                                style="
                                                    font-size:50px;
                                                "
                                            ></i>

                                        </div>

                                    `}


                            <!-- PRODUCT BADGE -->

                            <span
                                class="badge bg-warning text-dark position-absolute top-0 start-0 m-3"
                            >

                                ${e.badge||`NEW`}

                            </span>


                            <!-- OUT OF STOCK OVERLAY -->

                            ${n?`

                                        <div
                                            class="position-absolute top-50 start-50 translate-middle w-100 text-center"
                                        >

                                            <span
                                                class="badge bg-danger fs-6 px-3 py-2"
                                            >

                                                OUT OF STOCK

                                            </span>

                                        </div>

                                    `:``}

                        </div>


                        <!-- ================================================= -->
                        <!-- BODY -->
                        <!-- ================================================= -->

                        <div class="card-body">


                            <!-- CATEGORY -->

                            <span
                                class="badge bg-secondary"
                            >

                                ${e.category||``}

                            </span>


                            <!-- PRODUCT NAME -->

                            <h4 class="mt-3">

                                ${e.name}

                            </h4>


                            <!-- RATING -->

                            <div class="mb-3">

                                ${pe(e.rating)}

                            </div>


                            <!-- DESCRIPTION -->

                            <p>

                                ${e.description||``}

                            </p>


                            <!-- PRICE -->

                            <h3
                                class="text-warning fw-bold" data-product-price
                            >

                                ₦${Number(e.price||0).toLocaleString()}

                            </h3>


                            <!-- ================================================= -->
                            <!-- STOCK -->
                            <!-- ================================================= -->

                            <div data-product-stock>${b(e)}</div>


                            <!-- ================================================= -->
                            <!-- BUTTONS -->
                            <!-- ================================================= -->

                            <div
                                class="d-grid gap-2"
                            >

                                <button
                                    class="btn btn-warning view-product"
                                    data-id="${e.id}"
                                >

                                    View Details

                                </button>


                                <button
                                    class="btn btn-success add-to-cart"
                                    data-id="${e.id}"
                                    ${n?`disabled`:``}
                                >

                                    <i
                                        class="bi bi-cart-plus"
                                    ></i>

                                    ${n?`Out of Stock`:`Add to Cart`}

                                </button>

                            </div>


                        </div>

                    </div>

                </div>

            `}).join(``)}

                </div>


            </div>

        </section>

    `}async function S(){(await m()).forEach(e=>{let t=document.querySelector(`[data-product-card="${e.id}"]`);if(!t)return;let n=t.querySelector(`[data-product-stock]`),r=b(e);n&&n.innerHTML!==r&&(n.innerHTML=r);let i=t.querySelector(`[data-product-price]`),a=`₦${Number(e.price||0).toLocaleString()}`;i&&i.textContent.trim()!==a&&(i.textContent=a);let o=t.querySelector(`.add-to-cart`),s=Number(e.quantityAvailable??0)<=0;o&&(o.disabled=s,o.innerHTML=s?`Out of Stock`:`<i class="bi bi-cart-plus"></i> Add to Cart`)})}function ge(){return`

<section class="py-5 bg-warning">

<div class="container">

<div class="row text-center">

<div class="col-md-3">

<h2 class="fw-bold">10+</h2>

<p>Premium Products</p>

</div>

<div class="col-md-3">

<h2 class="fw-bold">100%</h2>

<p>Natural Ingredients</p>

</div>

<div class="col-md-3">

<h2 class="fw-bold">Halal</h2>

<p>Certified Quality</p>

</div>

<div class="col-md-3">

<h2 class="fw-bold">Made in Nigeria</h2>

<p>Proudly African</p>

</div>

</div>

</div>

</section>

`}function _e(){return`

<div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-xl modal-dialog-centered">

        <div class="modal-content bg-dark text-white border-warning">

            <div class="modal-header border-warning">

                <h3 class="modal-title text-warning">

                    Product Details

                </h3>

                <button
                    type="button"
                    class="btn-close btn-close-white"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body">

                <div class="row align-items-center">

                    <div class="col-lg-5 text-center">

                        <img
                            id="modalImage"
                            class="img-fluid rounded shadow product-modal-image"
                            alt="Product">

                    </div>

                    <div class="col-lg-7">

                        <span
                            id="modalCategory"
                            class="badge bg-secondary mb-2">

                            Category

                        </span>

                        <h1
                            id="modalTitle"
                            class="fw-bold mb-3">
                        </h1>

                        <div
                            id="modalRating"
                            class="mb-3 fs-4">
                        </div>

                        <h2
                            id="modalPrice"
                            class="text-warning fw-bold mb-4">
                        </h2>

                        <p
                            id="modalDescription"
                            class="text-light fs-5">
                        </p>

                        <div class="d-flex align-items-center gap-3 my-4">

                            <button
                                id="qtyMinus"
                                class="btn btn-outline-warning">

                                <i class="bi bi-dash-lg"></i>

                            </button>

                            <h3 id="modalQty">1</h3>

                            <button
                                id="qtyPlus"
                                class="btn btn-outline-warning">

                                <i class="bi bi-plus-lg"></i>

                            </button>

                        </div>

                        <div class="d-grid gap-3">

                            <button
                                id="modalAddToCart"
                                class="btn btn-warning btn-lg">

                                <i class="bi bi-cart-plus"></i>

                                Add to Cart

                            </button>

                            <button
                                class="btn btn-outline-light">

                                <i class="bi bi-heart"></i>

                                Add to Wishlist

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</div>

`}function ve(){return`

<section class="py-5 bg-black">

<div class="container">

<div class="row justify-content-center">

<div class="col-lg-8">

<div class="input-group">

<span class="input-group-text bg-warning border-warning">

<i class="bi bi-search"></i>

</span>

<input
type="text"
id="searchInput"
class="form-control"
placeholder="Search NutriDust products...">

</div>

</div>

</div>

</div>

</section>

`}function ye(){return`

<section class="py-3 bg-black">

<div class="container text-center">

<button class="btn btn-warning m-2 filter-btn" data-category="All">

All

</button>

<button class="btn btn-outline-warning m-2 filter-btn" data-category="Jerky">

Jerky

</button>

<button class="btn btn-outline-warning m-2 filter-btn" data-category="Stick Jerky">

Stick Jerky

</button>

<button class="btn btn-outline-warning m-2 filter-btn" data-category="Healthy Snack">

Healthy Snack

</button>

<button class="btn btn-outline-warning m-2 filter-btn" data-category="Nutrition">

Nutrition

</button>

</div>

</section>

`}function be(){return`

<div
    id="cart"
    class="offcanvas offcanvas-end text-bg-dark"
    tabindex="-1"
    aria-labelledby="cartTitle">

    <div class="offcanvas-header border-bottom border-secondary">

        <h4
            id="cartTitle"
            class="offcanvas-title text-warning fw-bold">

            <i class="bi bi-cart3 me-2"></i>

            Shopping Cart

        </h4>

        <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close">
        </button>

    </div>

    <div class="offcanvas-body">

        <div class="d-flex justify-content-end mb-3">
            <button id="clearCartButton" type="button" class="btn btn-sm btn-outline-danger d-none">
                <i class="bi bi-trash3 me-1"></i> Clear cart
            </button>
        </div>

        <div id="cartItems">

            <div class="text-center py-5">

                <i
                    class="bi bi-cart-x display-1 text-secondary">
                </i>

                <p class="mt-3 text-secondary">

                    Your cart is empty.

                </p>

            </div>

        </div>

        <hr>

        <div
            class="d-flex justify-content-between align-items-center">

            <h4 class="mb-0">

                Total

            </h4>

            <h4
                id="cartTotal"
                class="text-warning fw-bold mb-0">

                ₦0

            </h4>

        </div>

        <button
            id="checkoutButton"
            class="btn btn-warning w-100 mt-4">

            <i class="bi bi-credit-card me-2"></i>

            Proceed to Checkout

        </button>

    </div>

</div>

`}function xe(){return`

<div
class="modal fade"
id="checkoutModal"
tabindex="-1"
aria-labelledby="checkoutModalLabel"
aria-hidden="true">

<div class="modal-dialog modal-lg">

<div class="modal-content bg-dark text-white">

<div class="modal-header border-warning">

<h3
class="text-warning"
id="checkoutModalLabel">

Checkout

</h3>

<button
type="button"
class="btn-close btn-close-white"
data-bs-dismiss="modal"
aria-label="Close">
</button>

</div>

<div class="modal-body">

<form id="checkoutForm">

<fieldset class="mb-4">
<legend class="h5 text-warning fw-bold mb-3">Choose how to receive your order</legend>
<div class="row g-3">
<div class="col-md-6"><label class="fulfillment-option"><input class="fulfillment-radio" type="radio" name="fulfillmentType" value="pickup"><span class="fulfillment-icon"><i class="bi bi-bag-check-fill"></i></span><span class="fulfillment-copy"><strong>Self Pickup</strong><small>Pick up your order when it is ready.</small><b>FREE - No delivery charge</b></span><span class="fulfillment-check"><i class="bi bi-check-circle-fill"></i></span></label></div>
<div class="col-md-6"><label class="fulfillment-option"><input class="fulfillment-radio" type="radio" name="fulfillmentType" value="delivery" checked><span class="fulfillment-icon"><i class="bi bi-truck"></i></span><span class="fulfillment-copy"><strong>Delivered to You</strong><small>We bring your order to your address.</small><b>Delivery charge applies</b></span><span class="fulfillment-check"><i class="bi bi-check-circle-fill"></i></span></label></div>
</div>
</fieldset>

<div class="mb-3" id="deliveryAddressGroup">

<label
for="customerName"
class="form-label">

Full Name

</label>

<input
type="text"
class="form-control"
id="customerName"
name="customerName"
required>

</div>


<div class="mb-3">

<label
for="customerPhone"
class="form-label">

Phone Number

</label>

<input
type="tel"
class="form-control"
id="customerPhone"
name="customerPhone"
required>

</div>


<div class="mb-3">

<label
for="customerEmail"
class="form-label">

Email Address

</label>

<input
type="email"
class="form-control"
id="customerEmail"
name="customerEmail"
required>

</div>


<div class="mb-3">

<label
for="customerAddress"
class="form-label">

Delivery Address

</label>

<textarea
class="form-control"
rows="3"
id="customerAddress"
name="customerAddress"
required></textarea>

</div>


<hr>

<div class="d-flex justify-content-between mb-2"><span>Items subtotal</span><strong id="checkoutSubtotal">₦0</strong></div>
<div class="d-flex justify-content-between mb-3"><span>Delivery charge</span><strong id="checkoutDeliveryFee">₦0</strong></div>


<h4 class="text-warning">

Order Total

</h4>


<h2
id="checkoutTotal"
class="fw-bold">

₦0

</h2>


<button
type="submit"
id="continuePaymentButton"
class="btn btn-warning w-100 mt-4">

Continue to Payment

</button>

</form>

</div>

</div>

</div>

</div>

`}function Se(){return`
        <div
            class="modal fade"
            id="paymentSuccessModal"
            tabindex="-1"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">

                    <div class="modal-body text-center p-5">

                        <div
                            class="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                            style="
                                width: 80px;
                                height: 80px;
                                background: #d1e7dd;
                            "
                        >
                            <i
                                class="bi bi-check-lg text-success"
                                style="font-size: 3rem;"
                            ></i>
                        </div>

                        <h2 class="fw-bold mb-2">
                            Payment Successful!
                        </h2>

                        <p class="text-muted mb-4">
                            Thank you for shopping with
                            <strong>NutriDust Foods</strong>.
                        </p>

                        <div class="bg-light rounded p-3 mb-4 text-start">

                            <div class="d-flex justify-content-between mb-2">
                                <span>Order Number</span>
                                <strong id="successOrderId">
                                    —
                                </strong>
                            </div>

                            <div class="d-flex justify-content-between">
                                <span>Total Paid</span>
                                <strong id="successOrderAmount">
                                    —
                                </strong>
                            </div>

                        </div>

                        <div class="d-grid gap-2">

                            <button
                                type="button"
                                class="btn btn-dark"
                                id="viewOrderButton"
                            >
                                <i class="bi bi-receipt me-2"></i>
                                View Order
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    `}function Ce(){return`
        <section
            id="trackOrderSection"
            class="container py-5"
        >

            <div class="text-center mb-4">

                <span
                    class="text-uppercase fw-bold"
                    style="
                        color: #d4a017;
                        letter-spacing: 2px;
                    "
                >
                    Order Tracking
                </span>

                <h2 class="fw-bold mt-2">
                    Track My Order
                </h2>

                <p class="text-muted">
                    Enter your order number to see the current
                    status of your order.
                </p>

            </div>


            <div
                class="card border-0 shadow-sm mx-auto"
                style="max-width: 600px;"
            >

                <div class="card-body p-4">

                    <form id="trackOrderForm">

                        <label
                            for="trackOrderNumber"
                            class="form-label fw-semibold"
                        >
                            Order Number
                        </label>

                        <div class="input-group">

                            <span class="input-group-text">
                                #
                            </span>

                            <input
                                type="number"
                                class="form-control"
                                id="trackOrderNumber"
                                placeholder="Enter order number"
                                min="1"
                                required
                            />

                            <button
                                type="submit"
                                class="btn btn-dark"
                                id="trackOrderButton"
                            >
                                <i class="bi bi-search me-2"></i>
                                Track Order
                            </button>

                        </div>

                    </form>


                    <div
                        id="trackOrderResult"
                        class="mt-4"
                    ></div>

                </div>

            </div>

        </section>
    `}var C=e=>String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]);function we(){return`<div class="modal fade" id="customerProfileModal" tabindex="-1" aria-labelledby="customerProfileTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header bg-dark text-white"><h2 class="modal-title h5" id="customerProfileTitle"><i class="bi bi-person-circle me-2"></i>My Profile</h2><button class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="customerProfileContent"><div class="text-center py-5"><span class="spinner-border"></span></div></div></div></div></div>`}function Te(){document.getElementById(`customerProfileModal`)?.addEventListener(`show.bs.modal`,async()=>{let e=document.getElementById(`customerProfileContent`);e.innerHTML=`<div class="text-center py-5"><span class="spinner-border"></span></div>`;try{let[t,n]=await Promise.all([p(),_()]),r=t.customer,i=n.orders||[];e.innerHTML=`<div class="text-center mb-4"><div class="customer-profile-avatar mx-auto">${C(r.name?.[0]||`C`)}</div><h3 class="h4 mt-3 mb-1">${C(r.name)}</h3><span class="badge text-bg-success">Active customer</span></div><dl class="customer-profile-details"><div><dt><i class="bi bi-envelope me-2"></i>Email</dt><dd>${C(r.email)}</dd></div><div><dt><i class="bi bi-telephone me-2"></i>Phone</dt><dd>${C(r.phone)}</dd></div></dl><div class="row g-2 mt-3"><div class="col-6"><div class="profile-stat"><strong>${i.length}</strong><span>Total orders</span></div></div><div class="col-6"><div class="profile-stat"><strong>${i.filter(e=>e.orderStatus===`delivered`).length}</strong><span>Completed</span></div></div></div><button class="btn btn-warning w-100 mt-4" id="profileViewOrders"><i class="bi bi-box-seam me-2"></i>View My Orders</button>`,document.getElementById(`profileViewOrders`)?.addEventListener(`click`,()=>{window.dispatchEvent(new CustomEvent(`nutridust:open-orders`))})}catch{e.innerHTML=`<div class="alert alert-danger">Unable to load your profile. Please sign in again.</div>`}})}var w=e=>String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#39;`,'"':`&quot;`})[e]),T=e=>new Intl.NumberFormat(`en-NG`,{style:`currency`,currency:`NGN`,maximumFractionDigits:0}).format(Number(e||0)),E=e=>String(e||`pending`).replaceAll(`_`,` `).replace(/\b\w/g,e=>e.toUpperCase()),D=new Set([`picked_up`,`out_for_delivery`]);function O(){return`<div class="modal fade" id="customerOrdersModal" tabindex="-1" aria-labelledby="customerOrdersTitle" aria-hidden="true"><div class="modal-dialog modal-xl modal-dialog-scrollable"><div class="modal-content"><div class="modal-header bg-dark text-white"><div><h2 class="modal-title h5" id="customerOrdersTitle"><i class="bi bi-box-seam me-2"></i>My Orders</h2><small class="text-white-50">Track every purchase and fulfilment update</small></div><button class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="customerOrdersContent"><div class="text-center py-5"><span class="spinner-border"></span></div></div></div></div></div>`}function Ee(e){let t=e.fulfillmentType===`pickup`,n=[`delivered`,`cancelled`].includes(e.orderStatus),r=D.has(e.deliveryStatus);return`<article class="customer-order-card ${r?`customer-order-card-live`:``}"><div class="d-flex justify-content-between flex-wrap gap-2"><div><span class="text-secondary small">ORDER</span><h3 class="h5 mb-0">#${w(e.id)}</h3></div><div class="text-end"><span class="badge text-bg-${e.orderStatus===`delivered`?`success`:e.orderStatus===`cancelled`?`danger`:`warning`}">${w(E(e.orderStatus))}</span><strong class="d-block mt-2">${T(e.total)}</strong></div></div><hr>${r?`<div class="customer-live-banner"><span class="customer-live-pulse"></span><div><strong>Your rider is on the way</strong><small>The live position below refreshes automatically.</small></div></div>`:``}<div class="row g-3"><div class="col-md-5"><small class="text-secondary">Fulfilment</small><strong class="d-block"><i class="bi bi-${t?`bag-check`:`truck`} me-2"></i>${t?`Self Pickup`:`Delivered to You`}</strong></div><div class="col-md-4"><small class="text-secondary">Payment</small><strong class="d-block">${w(E(e.paymentStatus))}</strong></div><div class="col-md-3"><small class="text-secondary">Placed</small><strong class="d-block">${new Date(e.createdAt).toLocaleDateString()}</strong></div></div>${t?`<div class="alert alert-info mt-3 mb-0"><i class="bi bi-info-circle me-2"></i>You can collect this order when its status becomes <strong>Ready for Pickup</strong>.</div>`:`<div class="order-address mt-3"><i class="bi bi-geo-alt-fill"></i><span>${w(e.deliveryAddress)}</span></div>`}<div class="mt-3 d-flex gap-2 flex-wrap"><button class="btn btn-sm btn-dark track-saved-order" data-id="${w(e.id)}"><i class="bi bi-search me-1"></i>Track Order</button>${!t&&!n?`<button class="btn btn-sm btn-success live-rider-order" data-id="${w(e.id)}"><i class="bi bi-${r?`broadcast-pin`:`geo-alt-fill`} me-1"></i>${r?`View Live Rider`:`Rider Location`}</button>`:``}</div><div class="live-order-location mt-3" data-live-order="${w(e.id)}"></div></article>`}function De(){let e=document.getElementById(`customerOrdersModal`),t=document.getElementById(`customerOrdersContent`),n=!1,i=null,a=null,o=()=>{clearInterval(i),i=null,a=null},s=e=>{o(),a=String(e),c(a),i=setInterval(()=>{document.hidden||c(a)},3e3)},c=async e=>{let n=t?.querySelector(`[data-live-order="${e}"]`);if(!n)return o();try{let t=await te(e);n.innerHTML=r(t.tracking),t.tracking.active||o()}catch(e){n.innerHTML=`<div class="alert alert-warning mb-0">${w(e.response?.data?.message||`Unable to load the rider location.`)}</div>`}},l=()=>{t.querySelectorAll(`.track-saved-order`).forEach(e=>e.onclick=()=>{let t=document.getElementById(`trackOrderNumber`);t&&(t.value=e.dataset.id),window.dispatchEvent(new CustomEvent(`nutridust:track-order`,{detail:{orderId:e.dataset.id}}))}),t.querySelectorAll(`.live-rider-order`).forEach(e=>e.onclick=()=>s(e.dataset.id))},u=async(e=!1)=>{if(!(n||!t)){n=!0,e&&(t.innerHTML=`<div class="text-center py-5"><span class="spinner-border"></span></div>`);try{let e=(await _()).orders||[],n=e.length?`<div class="customer-order-list">${e.map(Ee).join(``)}</div>`:`<div class="text-center py-5"><i class="bi bi-bag display-3 text-secondary"></i><h3 class="h5 mt-3">No orders yet</h3><p class="text-secondary">Your completed purchases will appear here.</p></div>`;if(!a&&t.innerHTML!==n){t.innerHTML=n,l();let r=e.find(e=>D.has(e.deliveryStatus));r&&s(r.id)}}catch{e&&(t.innerHTML=`<div class="alert alert-danger">Unable to load your orders. Please try again.</div>`)}finally{n=!1}}};e?.addEventListener(`show.bs.modal`,()=>u(!0)),e?.addEventListener(`hidden.bs.modal`,o),setInterval(()=>{!document.hidden&&e?.classList.contains(`show`)&&!a&&u(!1)},3e3)}var Oe=`29 August 2026`,k=`support@nutridustfoods.com`,A=`info@nutridustfoods.com`,j=(e,t,n)=>`
    <div class="compliance-page">
        <header class="compliance-header">
            <a class="compliance-brand" href="/" aria-label="NutriDust Foods home">
                <img src="/favicon.svg" alt="" onerror="this.style.display='none'">
                <span>NutriDust Foods</span>
            </a>
            <a class="compliance-home" href="/">Back to shop</a>
        </header>
        <main class="compliance-main">
            <div class="compliance-title">
                <p class="compliance-kicker">NUTRIDUST FOODS</p>
                <h1>${e}</h1>
                <p>${t}</p>
                <small>Effective date: ${Oe}</small>
            </div>
            <article class="compliance-card">${n}</article>
        </main>
        ${N()}
    </div>
`,M=(e,t)=>`
    <section>
        <h2>${e}</h2>
        ${t}
    </section>
`;function N(){return`
        <footer class="compliance-footer">
            <div>
                <strong>NutriDust Foods</strong>
                <span>Premium nutrition, shopping and delivery services.</span>
            </div>
            <nav aria-label="Legal and support links">
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href="/account-deletion">Delete account</a>
                <a href="/support">Support</a>
            </nav>
            <small>&copy; ${new Date().getFullYear()} NutriDust Foods. All rights reserved.</small>
        </footer>
    `}var P=()=>j(`Privacy Policy`,`How we collect, use, protect and manage personal information across the NutriDust Foods website and apps.`,[M(`1. Who this policy covers`,`
            <p>This policy applies to customers, rider applicants, approved riders, staff and other people who use the NutriDust Foods website, Shop App, Rider App or Admin App.</p>
        `),M(`2. Information we collect`,`
            <ul>
                <li><strong>Account and contact details:</strong> name, email address, telephone number and login information.</li>
                <li><strong>Orders and delivery:</strong> products ordered, delivery or pickup choice, delivery address, order history and delivery status.</li>
                <li><strong>Payment information:</strong> payment status, amount and transaction reference. Card and bank details are entered with our payment provider and are not stored by NutriDust Foods.</li>
                <li><strong>Rider applications:</strong> names, contact details, vehicle type, plate number, driving licence where applicable, proof of ownership, inspection information and onboarding status.</li>
                <li><strong>Rider location:</strong> precise or approximate GPS coordinates, accuracy and update time while an approved rider is available or completing an assigned delivery.</li>
                <li><strong>Technical information:</strong> device, browser, IP address, diagnostic logs and security events needed to operate and protect the service.</li>
                <li><strong>Communications:</strong> messages and support requests sent to us.</li>
            </ul>
        `),M(`3. How we use information`,`
            <p>We use information to create and secure accounts; process orders and payments; calculate and arrange delivery; provide receipts and order updates; review and onboard riders; assign deliveries; show authorised staff the assigned rider's progress to pickup and delivery; show a customer the assigned rider's live progress only after pickup; provide customer support; prevent fraud; maintain records; and meet legal obligations.</p>
        `),M(`4. Services that process information`,`
            <p>We use carefully selected providers to operate NutriDust Foods, including hosting, database and file storage, email delivery, notifications and payment processing services. Paystack processes online payments under its own privacy terms. Providers receive only the information needed to perform their services.</p>
        `),M(`5. Sharing`,`
            <p>We do not sell personal information. We may share necessary order and contact details with assigned riders, authorised staff and service providers. During an active delivery, the customer may see the assigned rider's current location after pickup, while authorised staff may see the rider travelling to pickup and to the customer. Live customer visibility ends when the delivery is completed, cancelled or failed. We may disclose information where required by law, to protect users, or to investigate fraud and security incidents.</p>
        `),M(`6. Security and retention`,`
            <p>We use access controls, encrypted connections, restricted administrative permissions and other reasonable safeguards. No online system is completely risk-free. We keep information only as long as needed for operations, dispute resolution, fraud prevention and legal or financial record-keeping.</p>
        `),M(`7. Your choices and rights`,`
            <p>You may ask to access, correct or delete your personal information. You can also object to certain uses or withdraw consent where applicable. See our <a href="/account-deletion">Account and Data Deletion page</a> for deletion instructions.</p>
        `),M(`8. Children`,`
            <p>NutriDust Foods services are not directed to children who cannot legally consent to the processing of their personal information. A parent or guardian should contact us if a child has provided information without appropriate permission.</p>
        `),M(`9. Contact`,`
            <p>Privacy questions and requests can be sent to <a href="mailto:${k}">${k}</a>.</p>
        `)].join(``)),F=()=>j(`Terms and Conditions`,`The rules that apply when using NutriDust Foods services.`,[M(`1. Acceptance`,`<p>By accessing or using NutriDust Foods, you agree to these terms. If you do not agree, do not use the service.</p>`),M(`2. Accounts`,`<p>You must provide accurate information, protect your password and promptly report unauthorised access. You are responsible for activity performed through your account. Staff and rider accounts may be used only by the person to whom they are assigned.</p>`),M(`3. Products, prices and availability`,`<p>Product descriptions, prices and stock may change. An order is accepted only after it is confirmed by our system. We may correct genuine pricing or stock errors and will contact you when an order cannot be fulfilled.</p>`),M(`4. Orders and payments`,`<p>You must provide complete delivery and contact details. Online payments are processed through our payment provider. A successful payment notification does not prevent us from carrying out fraud, stock or delivery checks. Refunds, where approved, are returned using an appropriate available method.</p>`),M(`5. Delivery and pickup`,`<p>Delivery fees and estimates depend on the selected location and service conditions. Delivery times are estimates and can be affected by traffic, weather, access restrictions and events outside our control. Customers must provide a reachable telephone number and a safe, accurate delivery location.</p>`),M(`6. Rider and staff use`,`<p>Rider applications are subject to document review, physical inspection where required and approval. Approval is not guaranteed. NutriDust Foods may suspend or disable rider and staff access for safety, fraud, misconduct, policy breaches or operational reasons.</p>`),M(`7. Acceptable use`,`<p>You must not misuse the service, interfere with its security, impersonate another person, submit false documents, attempt unauthorised access, or use the service for unlawful or harmful activity.</p>`),M(`8. Service availability`,`<p>We work to keep the service available but do not guarantee uninterrupted access. Features may be changed, suspended or withdrawn for maintenance, security, legal or operational reasons.</p>`),M(`9. Liability`,`<p>To the extent permitted by applicable law, NutriDust Foods is not responsible for indirect or consequential losses arising from use of the service. Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded.</p>`),M(`10. Changes and governing law`,`<p>We may update these terms and will publish the effective date. These terms are governed by applicable laws of the Federal Republic of Nigeria.</p>`),M(`11. Contact`,`<p>Questions about these terms can be sent to <a href="mailto:${k}">${k}</a>.</p>`)].join(``)),I=()=>j(`Account and Data Deletion`,`Request deletion of a NutriDust Foods customer, rider or staff account and associated personal data.`,[M(`How to request deletion`,`
            <ol>
                <li>Email <a href="mailto:${k}?subject=Account%20Deletion%20Request">${k}</a> using the email address registered to your account.</li>
                <li>Use the subject <strong>Account Deletion Request</strong>.</li>
                <li>State whether the request concerns a customer, rider or staff account and provide your registered name and telephone number. Do not send your password, payment card information or one-time verification codes.</li>
                <li>We may ask for limited information to verify ownership and protect the account from an unauthorised deletion request.</li>
            </ol>
            <p>You may also use an in-app deletion option if it is available in your account settings.</p>
        `),M(`What will be deleted`,`<p>After verification, we will close the account and delete or anonymise profile details, saved addresses, authentication data and other personal information that is not required for an ongoing transaction or lawful retention.</p>`),M(`What may be retained`,`<p>Completed order, payment, fraud-prevention, safety, rider inspection and financial records may be retained where reasonably necessary for legal obligations, accounting, disputes and security. Retained information is restricted and deleted or anonymised when the applicable need ends.</p>`),M(`Processing time`,`<p>We aim to acknowledge requests promptly and complete verified requests within 30 days, unless additional time is permitted or required by law. We will explain any necessary delay.</p>`),M(`Deletion without an account`,`<p>If you submitted a rider application or contacted support without creating an active account, use the same email process and identify the application or communication you want removed.</p>`)].join(``)),ke={"/privacy":P,"/privacy-policy":P,"/terms":F,"/terms-and-conditions":F,"/account-deletion":I,"/delete-account":I,"/support":()=>j(`Support`,`Help with orders, payments, accounts, rider onboarding and NutriDust Foods services.`,[M(`Customer and account support`,`<p>Email <a href="mailto:${k}">${k}</a> for login problems, payment concerns, refunds, account changes, complaints or technical support.</p>`),M(`Orders and general enquiries`,`<p>Email <a href="mailto:${A}">${A}</a> for order enquiries, product information and general business questions.</p>`),M(`Rider onboarding`,`<p>Rider applicants should use the Rider App to submit an application. For application or onboarding assistance, contact <a href="mailto:${k}">${k}</a>.</p>`),M(`When contacting us`,`<p>Include your name, registered telephone number and order or application number where relevant. Never send a password, one-time verification code, full payment-card number or API key.</p>`),M(`Security and urgent concerns`,`<p>Report suspected account misuse or a safety concern immediately to <a href="mailto:${k}">${k}</a>. For emergencies, contact the appropriate local emergency service.</p>`)].join(``))};function Ae(){let e=window.location.pathname.replace(/\/$/,``)||`/`,t=ke[e.toLowerCase()];return t?(document.title=`${e.includes(`privacy`)?`Privacy Policy`:e.includes(`terms`)?`Terms and Conditions`:e.includes(`deletion`)||e.includes(`delete`)?`Account Deletion`:`Support`} | NutriDust Foods`,document.querySelector(`#app`).innerHTML=t(),!0):!1}var L=JSON.parse(localStorage.getItem(`nutridust-cart`))||[];function R(){localStorage.setItem(`nutridust-cart`,JSON.stringify(L))}function z(){return L}function B(e){let t=e._id||e.id,n=Number(e.quantityAvailable??0);if(n<=0)return{success:!1,message:`${e.name} is currently out of stock.`};let r=L.find(e=>(e._id||e.id)==t);if(r){if(r.quantity>=n)return{success:!1,message:`Only ${n.toLocaleString()} unit(s) of ${e.name} are available.`};r.quantity++,r.quantityAvailable=n}else L.push({...e,_id:t,quantity:1,quantityAvailable:n});return R(),{success:!0,cart:L}}function je(){return L.reduce((e,t)=>e+Number(t.quantity||0),0)}function Me(e){let t=L.find(t=>(t._id||t.id)==e);if(!t)return{success:!1,message:`Product not found in cart.`};let n=Number(t.quantityAvailable??0);return t.quantity>=n?{success:!1,message:`Only ${n.toLocaleString()} unit(s) available.`}:(t.quantity++,R(),{success:!0,cart:L})}function Ne(e){let t=L.find(t=>(t._id||t.id)==e);return t?(t.quantity--,t.quantity<=0&&(L=L.filter(t=>(t._id||t.id)!=e)),R(),{success:!0,cart:L}):{success:!1,message:`Product not found in cart.`}}function V(){L=[],R()}function Pe(e){let t=L.length;return L=L.filter(t=>(t._id||t.id)!=e),R(),{success:L.length<t,cart:L}}function H(){let e=z(),t=document.getElementById(`cartItems`),n=document.getElementById(`cartTotal`),r=document.getElementById(`cartCount`),i=document.getElementById(`clearCartButton`),a=document.getElementById(`checkoutButton`);if(!t||!n||!r)return;if(r.textContent=je(),e.length===0){i?.classList.add(`d-none`),a&&(a.disabled=!0),t.innerHTML=`

            <div class="nutridust-cart-empty">

                <div class="nutridust-cart-empty-icon">

                    <i class="bi bi-cart-x"></i>

                </div>

                <h5>
                    Your cart is empty
                </h5>

                <p>
                    Add some delicious NutriDust products
                    to get started.
                </p>

            </div>

        `,n.textContent=`₦0`;return}i?.classList.remove(`d-none`),a&&(a.disabled=!1);let o=0;t.innerHTML=``,e.forEach(e=>{let n=e._id||e.id,r=Number(e.quantity||0),i=Number(e.quantityAvailable??0),a=Math.max(0,i-r),s=Number(e.price||0),c=s*r;o+=c;let l=r>=i,u=e.image||e.imageUrl||e.productImage||``;u&&!u.startsWith(`http`)&&!u.startsWith(`data:`)&&(u=`https://nutridustfoods.onrender.com${u}`);let d=u?`

            <div
                style="
                    width:120px;
                    height:120px;
                    max-width:120px;
                    max-height:120px;
                    min-width:120px;
                    min-height:120px;
                    flex:0 0 70px;
                    overflow:hidden;
                    border-radius:8px;
                    background:#222;
                "
            >

                <img
                    src="${U(u)}"
                    alt="${U(e.name)}"
                    style="
                        width:120px;
                        height:120px;
                        max-width:120px;
                        max-height:120px;
                        min-width:120px;
                        min-height:120px;
                        object-fit:cover;
                        display:block;
                    "
                    onerror="this.style.display='none';"
                >

            </div>

        `:`

    <div
        style="
            width:70px;
            height:70px;
            min-width:70px;
            max-width:70px;
            min-height:70px;
            max-height:70px;
            flex:0 0 70px;
            border-radius:8px;
            background:#222;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#777;
        "
    >

        <i class="bi bi-box-seam"></i>

    </div>

`,f=``;f=i<=0?`

                <div class="nutridust-stock-danger">

                    <i class="bi bi-x-circle-fill"></i>

                    <span>
                        Out of stock
                    </span>

                </div>

            `:a<=0?`

                <div class="nutridust-stock-warning">

                    <i class="bi bi-exclamation-circle-fill"></i>

                    <span>
                        Maximum available quantity selected
                    </span>

                </div>

            `:`

                <div class="nutridust-stock-success">

                    <i class="bi bi-box-seam-fill"></i>

                    <span>
                        ${a.toLocaleString()}
                        available
                    </span>

                </div>

            `,t.innerHTML+=`

            <div class="nutridust-cart-item">


                <!-- ================================= -->
                <!-- PRODUCT INFORMATION -->
                <!-- ================================= -->

                <div class="nutridust-cart-product">


                    <!-- ============================= -->
                    <!-- PRODUCT IMAGE -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-image-wrapper">

                        ${d}

                    </div>


                    <!-- ============================= -->
                    <!-- PRODUCT DETAILS -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-product-info">

                        <h5 class="nutridust-cart-product-name">

                            ${U(e.name)}

                        </h5>


                        <div class="nutridust-cart-unit-price">

                            ₦${s.toLocaleString()}

                            <span>
                                each
                            </span>

                        </div>


                        ${f}

                    </div>


                    <!-- ============================= -->
                    <!-- SUBTOTAL -->
                    <!-- ============================= -->

                    <div class="nutridust-cart-subtotal">

                        ₦${c.toLocaleString()}

                        <button
                            class="btn btn-sm btn-outline-danger remove-cart-item mt-2"
                            data-id="${U(n)}"
                            data-name="${U(e.name)}"
                            type="button"
                            aria-label="Remove ${U(e.name)} from cart">
                            <i class="bi bi-trash3 me-1"></i> Remove
                        </button>

                    </div>


                </div>


                <!-- ================================= -->
                <!-- QUANTITY CONTROLS -->
                <!-- ================================= -->

                <div class="nutridust-cart-controls-row">


                    <span class="nutridust-cart-quantity-label">

                        Quantity

                    </span>


                    <div class="nutridust-cart-quantity-controls">


                        <!-- DECREASE -->

                        <button
                            class="nutridust-cart-quantity-btn decrease-btn"
                            data-id="${U(n)}"
                            type="button"
                            ${r<=1?`disabled`:``}
                            aria-label="Decrease quantity"
                        >

                            <i class="bi bi-dash"></i>

                        </button>


                        <!-- QUANTITY -->

                        <div class="nutridust-cart-quantity">

                            ${r}

                        </div>


                        <!-- INCREASE -->

                        <button
                            class="nutridust-cart-quantity-btn increase-btn"
                            data-id="${U(n)}"
                            type="button"
                            ${l||i<=0?`disabled`:``}
                            aria-label="Increase quantity"
                        >

                            <i class="bi bi-plus"></i>

                        </button>


                    </div>


                    <span class="nutridust-cart-stock-total">

                        ${i.toLocaleString()}
                        total stock

                    </span>

                </div>


            </div>

        `}),n.textContent=`₦`+o.toLocaleString(),document.querySelectorAll(`.increase-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Me(e.dataset.id);t&&!t.success&&t.message&&alert(t.message),H()})}),document.querySelectorAll(`.decrease-btn`).forEach(e=>{e.addEventListener(`click`,()=>{Ne(e.dataset.id),H()})}),document.querySelectorAll(`.remove-cart-item`).forEach(e=>{e.addEventListener(`click`,()=>{window.confirm(`Remove ${e.dataset.name||`this item`} from your cart?`)&&(Pe(e.dataset.id),H())})}),i&&(i.onclick=()=>{window.confirm(`Remove all items from your cart?`)&&(V(),H())})}function U(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var W=`https://nutridustfoods.onrender.com`,G=null,K=1;function Fe(e){if(!e)return``;let t=String(e).trim();return t?t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`)?t:t.startsWith(`/uploads/`)?W+t:t.startsWith(`uploads/`)?`https://nutridustfoods.onrender.com/`+t:`${W}/uploads/products/${t}`:``}function q(e){if(!e){console.error(`❌ Cannot show product: product not found.`);return}G=e,K=1;let r=document.getElementById(`productModal`),i=document.getElementById(`modalImage`),a=document.getElementById(`modalCategory`),o=document.getElementById(`modalTitle`),s=document.getElementById(`modalPrice`),c=document.getElementById(`modalDescription`),l=document.getElementById(`modalQty`),u=document.getElementById(`modalRating`),d=document.getElementById(`modalAddToCart`);if(!r){console.error(`❌ Product modal element not found.`);return}let f=Fe(e.image);if(console.log(`🖼️ Product image:`,e.image),console.log(`🖼️ Modal image URL:`,f),i){if(f)i.src=f,i.alt=e.name||`Product`,i.style.display=`block`,i.onerror=()=>{console.error(`❌ Product modal image failed:`,f),i.removeAttribute(`src`),i.style.display=`none`;let e=i.parentElement;e&&!e.querySelector(`.modal-image-fallback`)&&e.insertAdjacentHTML(`beforeend`,`

                        <div
                            class="
                                modal-image-fallback
                                d-flex
                                align-items-center
                                justify-content-center
                                bg-secondary
                                rounded
                            "
                            style="
                                min-height:320px;
                                width:100%;
                            "
                        >

                            <div class="text-center text-light">

                                <i
                                    class="bi bi-image"
                                    style="font-size:70px;"
                                ></i>

                                <p class="mt-3 mb-0">
                                    Product image unavailable
                                </p>

                            </div>

                        </div>

                        `)};else{i.removeAttribute(`src`),i.style.display=`none`;let e=i.parentElement;e&&!e.querySelector(`.modal-image-fallback`)&&e.insertAdjacentHTML(`beforeend`,`

                    <div
                        class="
                            modal-image-fallback
                            d-flex
                            align-items-center
                            justify-content-center
                            bg-secondary
                            rounded
                        "
                        style="
                            min-height:320px;
                            width:100%;
                        "
                    >

                        <div class="text-center text-light">

                            <i
                                class="bi bi-image"
                                style="font-size:70px;"
                            ></i>

                            <p class="mt-3 mb-0">
                                No product image
                            </p>

                        </div>

                    </div>

                    `)}}a&&(a.textContent=e.category||``),o&&(o.textContent=e.name||``),s&&(s.textContent=`₦${Number(e.price||0).toLocaleString()}`),c&&(c.textContent=e.description||``),u&&(u.innerHTML=Ie(Number(e.rating||0))),l&&(l.textContent=K),d&&(d.onclick=()=>{if(G){for(let e=0;e<K;e++)B(G);H(),n.getOrCreateInstance(r).hide(),r.addEventListener(`hidden.bs.modal`,()=>{let e=document.getElementById(`cart`);e&&t.getOrCreateInstance(e).show()},{once:!0})}}),n.getOrCreateInstance(r).show()}function Ie(e){let t=Math.max(0,Math.min(5,Number(e)||0)),n=``;for(let e=1;e<=5;e++)n+=e<=t?`

                <i
                    class="bi bi-star-fill text-warning me-1"
                ></i>

            `:`

                <i
                    class="bi bi-star text-warning me-1"
                ></i>

            `;return n}document.addEventListener(`click`,e=>{if(!e.target.closest(`#qtyPlus`))return;K++;let t=document.getElementById(`modalQty`);t&&(t.textContent=K)}),document.addEventListener(`click`,e=>{if(!e.target.closest(`#qtyMinus`))return;K>1&&K--;let t=document.getElementById(`modalQty`);t&&(t.textContent=K)});function J(){try{return l()||null}catch(e){return console.error(`❌ Unable to read customer session:`,e),null}}function Y(){let e=c(),t=J();return!!(e&&t)}function X(){let e=document.getElementById(`customerAuthModal`);if(!e){console.error(`❌ Customer authentication modal was not found.`),alert(`Please login or create an account before checkout.`);return}n.getOrCreateInstance(e).show()}function Le(e){if(!e)return 0;let t=[e.total,e.totalAmount,e.total_amount,e.amount,e.paidAmount,e.paid_amount,e.grandTotal,e.grand_total];for(let e of t)if(e!=null&&e!==``&&Number.isFinite(Number(e)))return Number(e);return 0}function Z(e){let t=Number(e);return Number.isFinite(t)?`₦`+t.toLocaleString(`en-NG`):`₦0`}async function Re(){let e=new URLSearchParams(window.location.search),t=e.get(`reference`)||e.get(`trxref`);if(!t)return!1;console.log(`🔍 Payment callback detected:`,t);try{let e=await re(t);if(console.log(`✅ Payment verification result:`,e),!e||!e.success||!e.order)throw Error(e?.message||`Payment verification failed.`);console.log(`📦 Verified order:`,e.order);let r=Le(e.order);console.log(`💰 Total paid:`,r),V(),H(),window.history.replaceState({},document.title,window.location.pathname),localStorage.removeItem(`nutridust-pending-order`);let i=document.getElementById(`paymentSuccessModal`);if(!i)return console.error(`❌ Payment success modal was not found.`),!0;let a=document.getElementById(`successOrderId`);a&&(a.textContent=`#${e.order.id}`);let o=document.getElementById(`successOrderAmount`);return o&&(o.textContent=Z(r)),n.getOrCreateInstance(i).show(),!0}catch(e){return console.error(`❌ Payment verification failed:`,e),window.history.replaceState({},document.title,window.location.pathname),alert(`We could not verify your payment.

`+(e?.message||`Unknown payment verification error.`)),!1}}function Q(e){let t=String(e?.orderStatus||`pending`).toLowerCase();(t===`shipped`||t===`on_delivery`)&&(t=`out_for_delivery`);let n=e?.fulfillmentType===`pickup`,r=n?[`pending`,`processing`,`ready_for_pickup`,`delivered`]:[`pending`,`processing`,`out_for_delivery`,`delivered`],i=n?{pending:`Pending`,processing:`Processing`,ready_for_pickup:`Ready for Pickup`,delivered:`Collected`}:{pending:`Pending`,processing:`Processing`,out_for_delivery:`On Delivery`,delivered:`Delivered`},a=r.indexOf(t);if(t===`cancelled`)return`

            <div class="alert alert-danger mb-4">

                <div class="d-flex align-items-center">

                    <i
                        class="bi bi-x-circle-fill me-2"
                        style="font-size: 1.4rem;"
                    ></i>

                    <div>

                        <strong>
                            Order Cancelled
                        </strong>

                        <div class="small">
                            This order has been cancelled.
                        </div>

                    </div>

                </div>

            </div>

        `;let o=a>=0?a:0;return`

        <div class="mb-4">

            <h6 class="fw-bold mb-3">
                Order Progress
            </h6>


            <div
                class="
                    d-flex
                    justify-content-between
                    text-center
                "
            >

                ${r.map((e,t)=>{let n=t<=o;return`

                            <div
                                style="flex: 1;"
                            >

                                <div
                                    class="
                                        mx-auto
                                        rounded-circle
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                        ${n?`bg-success text-white`:`bg-light text-secondary`}
                                    "
                                    style="
                                        width: 36px;
                                        height: 36px;
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            ${n?`bi-check-lg`:`bi-circle`}
                                        "
                                    ></i>

                                </div>


                                <small
                                    class="
                                        d-block
                                        mt-2
                                        ${t===o?`fw-bold text-success`:`text-muted`}
                                    "
                                >

                                    ${i[e]||e}

                                </small>

                            </div>

                        `}).join(``)}

            </div>

        </div>

    `}function $(e){let t=Array.isArray(e?.items)?e.items:[];return t.length===0?`

            <p class="text-muted mb-0">

                No order items available.

            </p>

        `:t.map(e=>`

            <div
                class="
                    d-flex
                    justify-content-between
                    align-items-center
                    border-bottom
                    py-2
                "
            >

                <div>

                    <div class="fw-semibold">

                        ${e.name||`Product`}

                    </div>

                    <small class="text-muted">

                        Qty: ${Number(e.quantity||0)}

                    </small>

                </div>


                <strong>

                    ${Z(e.total||0)}

                </strong>

            </div>

        `).join(``)}async function ze(){try{if(Ae())return;let e=await m();if(document.querySelector(`#app`).innerHTML=`

            ${le()}

            ${de()}

            ${fe()}

            ${ve()}

            ${ye()}

            ${await x()}

            ${ge()}

            ${Ce()}

            ${_e()}

            ${be()}

            ${xe()}

            ${Se()}

            ${se()}

            ${we()}

            ${O()}

            ${N()}

        `,ce(),ue(),Te(),De(),window.addEventListener(`nutridust:track-order`,e=>{let t=document.getElementById(`customerOrdersModal`);t&&n.getInstance(t)?.hide(),document.getElementById(`trackOrderSection`)?.scrollIntoView({behavior:`smooth`,block:`start`});let r=document.getElementById(`trackOrderNumber`);r&&(r.value=e.detail?.orderId||r.value),setTimeout(()=>document.getElementById(`trackOrderForm`)?.requestSubmit(),350)}),c())try{let e=await p();e?.success&&console.log(`✅ Current customer loaded:`,e.customer)}catch(e){console.warn(`⚠️ Unable to refresh customer session:`,e?.message)}console.log(`🔐 Customer session:`,J()),H(),await Re();let r=document.getElementById(`cart`),i=t.getOrCreateInstance(r),a=document.getElementById(`cartButton`);a&&a.addEventListener(`click`,()=>{let e=document.getElementById(`productModal`);if(e&&e.classList.contains(`show`)){let t=n.getOrCreateInstance(e);e.addEventListener(`hidden.bs.modal`,()=>{i.show()},{once:!0}),t.hide()}else i.show()}),document.querySelectorAll(`.view-product`).forEach(t=>{t.addEventListener(`click`,()=>{let n=e.find(e=>e.id===Number(t.dataset.id));if(!n){console.error(`❌ Product not found:`,t.dataset.id);return}q(n)})}),document.querySelectorAll(`.add-to-cart`).forEach(t=>{t.addEventListener(`click`,()=>{let n=e.find(e=>e.id===Number(t.dataset.id));if(!n){console.error(`❌ Product not found:`,t.dataset.id);return}B(n),H()})});let o=document.getElementById(`checkoutButton`);o&&o.addEventListener(`click`,()=>{if(z().length===0){alert(`Your cart is empty.`);return}if(!Y()){console.log(`🔐 Checkout blocked: customer is not logged in.`),i.hide(),X();return}let e=J();console.log(`✅ Customer allowed to checkout:`,e),i.hide();let t=document.getElementById(`checkoutTotal`),r=document.getElementById(`cartTotal`);t&&r&&(t.textContent=r.textContent),n.getOrCreateInstance(document.getElementById(`checkoutModal`)).show()});let s=document.getElementById(`checkoutForm`);if(s){let e=null,t=async(t=!1)=>{let n=s.querySelector(`input[name="fulfillmentType"]:checked`)?.value||`delivery`,r=document.getElementById(`deliveryAddressGroup`),i=document.getElementById(`customerAddress`),a=document.getElementById(`checkoutDeliveryFee`),o=document.getElementById(`cartTotal`)?.textContent||`0`,c=Number(o.replace(/[^0-9.]/g,``))||0,l=0;if(n===`delivery`&&t&&i?.value.trim().length>=5){a&&(a.textContent=`Calculating route…`);try{e=await g(i.value.trim())}catch(t){e=null,a&&(a.textContent=t.response?.data?.message||`Unable to calculate`);return}}n===`delivery`&&(l=Number(e?.fee||0)),r&&r.classList.toggle(`d-none`,n===`pickup`),i&&(i.required=n===`delivery`);let u=document.getElementById(`checkoutSubtotal`),d=document.getElementById(`checkoutTotal`);u&&(u.textContent=`₦${c.toLocaleString()}`),a&&(a.textContent=n===`pickup`?`Free`:l?`₦${l.toLocaleString()} (${e.estimated?`local test rate`:`${e.distanceKm} km`})`:`Enter your address`),d&&(d.textContent=`₦${(c+l).toLocaleString()}`)};s.querySelectorAll(`input[name="fulfillmentType"]`).forEach(n=>n.addEventListener(`change`,()=>{e=null,t(!1)})),document.getElementById(`customerAddress`)?.addEventListener(`blur`,()=>t(!0)),document.getElementById(`checkoutModal`)?.addEventListener(`shown.bs.modal`,t),s.addEventListener(`submit`,async e=>{if(e.preventDefault(),!Y()){alert(`Please login before placing your order.`),X();return}if(!J()){alert(`Your customer session could not be found. Please login again.`);return}let t=e.currentTarget.querySelector(`button[type="submit"]`),n=document.getElementById(`customerAddress`)?.value?.trim()||``,r=e.currentTarget.querySelector(`input[name="fulfillmentType"]:checked`)?.value||`delivery`;if(r===`delivery`&&!n){alert(`Please enter your delivery address.`);return}let i=z();if(i.length===0){alert(`Your cart is empty.`);return}let a=i.map(e=>({productId:Number(e.id||e._id),quantity:Number(e.quantity)}));if(a.some(e=>!Number.isInteger(e.productId)||e.productId<=0||!Number.isInteger(e.quantity)||e.quantity<=0)){alert(`One or more products in your cart are invalid. Please refresh the page and try again.`);return}let o={deliveryAddress:n,fulfillmentType:r,items:a};console.log(`📦 Sending authenticated customer order:`,o);try{t&&(t.disabled=!0,t.textContent=`Creating Order...`);let e=await h(o);if(console.log(`✅ Order created:`,e),!e||!e.success||!e.order)throw Error(e?.message||`The order could not be created.`);let n=e.order.id;t&&(t.textContent=`Connecting to Payment...`),console.log(`💳 Payment initialization for Order:`,n);let r=await ne(n);if(console.log(`💳 Payment response:`,r),!r||!r.success||!r.authorizationUrl)throw Error(r?.message||`Unable to initialize payment.`);localStorage.setItem(`nutridust-pending-order`,String(n)),window.location.href=r.authorizationUrl}catch(e){console.error(`❌ Checkout / Payment Error:`,e),e?.response?.status===401?(alert(`Your login session has expired. Please login again.`),X()):alert(`Unable to continue to payment.

`+(e?.response?.data?.message||e?.message||`Unknown error.`)),t&&(t.disabled=!1,t.textContent=`Continue to Payment`)}})}let l=document.getElementById(`trackOrderForm`);l&&l.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`trackOrderNumber`),n=document.getElementById(`trackOrderResult`),r=document.getElementById(`trackOrderButton`),i=t?.value?.trim()||``;if(!i){n.innerHTML=`

                            <div class="alert alert-warning">

                                Please enter your order number.

                            </div>

                        `;return}if(!Y()){n.innerHTML=`

                            <div class="alert alert-warning">

                                <i class="bi bi-person-lock me-2"></i>

                                Please login to view your order.

                            </div>

                        `,X();return}r.disabled=!0,r.innerHTML=`

                        <span
                            class="spinner-border spinner-border-sm me-2"
                        ></span>

                        Loading...

                    `,n.innerHTML=``;try{console.log(`📦 Loading customer order:`,i);let e=await v(i);if(console.log(`📦 Customer Order:`,e),!e||!e.success||!e.order)throw Error(e?.message||`Order not found.`);let t=e.order,r=Q(t),a=$(t);n.innerHTML=`

                            <div
                                class="
                                    border
                                    rounded
                                    p-4
                                    bg-white
                                "
                            >

                                <div
                                    class="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        mb-4
                                    "
                                >

                                    <div>

                                        <h5 class="fw-bold mb-1">

                                            Order #${t.id}

                                        </h5>


                                        <small class="text-muted">

                                            ${t.createdAt||``}

                                        </small>

                                    </div>


                                    <span
                                        class="
                                            badge
                                            ${String(t.paymentStatus||`pending`).toLowerCase()===`paid`?`bg-success`:`bg-warning text-dark`}
                                        "
                                    >

                                        ${String(t.paymentStatus||`pending`).toUpperCase()}

                                    </span>

                                </div>


                                ${r}


                                <!-- PAYMENT -->

                                <div
                                    class="
                                        bg-light
                                        rounded
                                        p-3
                                        mb-4
                                    "
                                >

                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                            mb-2
                                        "
                                    >

                                        <span>
                                            Payment
                                        </span>


                                        <strong
                                            class="text-success text-uppercase"
                                        >

                                            ${t.paymentStatus||`pending`}

                                        </strong>

                                    </div>


                                    <div
                                        class="
                                            d-flex
                                            justify-content-between
                                        "
                                    >

                                        <span>
                                            Total
                                        </span>


                                        <strong>

                                            ${Z(t.total)}

                                        </strong>

                                    </div>

                                </div>


                                <!-- ITEMS -->

                                <h6 class="fw-bold mb-2">

                                    Items

                                </h6>


                                <div class="mb-4">

                                    ${a}

                                </div>


                                <!-- DELIVERY -->

                                <h6 class="fw-bold mb-2">

                                    ${t.fulfillmentType===`pickup`?`Fulfilment`:`Delivery Address`}

                                </h6>


                                <div
                                    class="
                                        bg-light
                                        rounded
                                        p-3
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            bi-geo-alt
                                            me-2
                                        "
                                    ></i>


                                    ${t.fulfillmentType===`pickup`?`Customer pickup — no delivery charge`:t.deliveryAddress||`No delivery address provided.`}

                                </div>

                            </div>

                        `}catch(e){console.error(`❌ Track Order Error:`,e),n.innerHTML=`

                            <div class="alert alert-danger">

                                <i
                                    class="bi bi-exclamation-circle me-2"
                                ></i>

                                <strong>
                                    Unable to load order
                                </strong>


                                <div class="small mt-1">

                                    ${e?.response?.data?.message||e?.message||`Please check the order number and try again.`}

                                </div>

                            </div>

                        `}finally{r.disabled=!1,r.innerHTML=`

                            <i class="bi bi-search me-2"></i>

                            Track Order

                        `}});let u=document.getElementById(`viewOrderButton`);u&&u.addEventListener(`click`,async()=>{if(!Y()){alert(`Please login to view your order.`),X();return}let e=document.getElementById(`successOrderId`)?.textContent.replace(`#`,``).trim();if(!e){alert(`Order number could not be found.`);return}try{console.log(`📦 Loading customer order:`,e);let t=await v(e);if(console.log(`📦 Order Details:`,t),!t||!t.success||!t.order){alert(t?.message||`Unable to load your order.`);return}let r=t.order,i=Q(r),a=$(r),o=document.getElementById(`customerOrderDetailsModal`);o&&o.remove();let s=`

                            <div
                                class="modal fade"
                                id="customerOrderDetailsModal"
                                tabindex="-1"
                                aria-hidden="true"
                            >

                                <div
                                    class="
                                        modal-dialog
                                        modal-dialog-centered
                                        modal-dialog-scrollable
                                    "
                                >

                                    <div
                                        class="
                                            modal-content
                                            border-0
                                            shadow-lg
                                        "
                                    >

                                        <div class="modal-header">

                                            <div>

                                                <h5
                                                    class="
                                                        modal-title
                                                        fw-bold
                                                        mb-1
                                                    "
                                                >

                                                    Order #${r.id}

                                                </h5>


                                                <small class="text-muted">

                                                    ${r.createdAt||``}

                                                </small>

                                            </div>


                                            <button
                                                type="button"
                                                class="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            ></button>

                                        </div>


                                        <div class="modal-body">

                                            ${i}


                                            <!-- PAYMENT -->

                                            <div
                                                class="
                                                    bg-light
                                                    rounded
                                                    p-3
                                                    mb-4
                                                "
                                            >

                                                <div
                                                    class="
                                                        d-flex
                                                        justify-content-between
                                                        mb-2
                                                    "
                                                >

                                                    <span>
                                                        Payment
                                                    </span>


                                                    <strong
                                                        class="
                                                            text-success
                                                            text-uppercase
                                                        "
                                                    >

                                                        ${r.paymentStatus||`pending`}

                                                    </strong>

                                                </div>


                                                <div
                                                    class="
                                                        d-flex
                                                        justify-content-between
                                                    "
                                                >

                                                    <span>
                                                        Total
                                                    </span>


                                                    <strong>

                                                        ${Z(r.total)}

                                                    </strong>

                                                </div>

                                            </div>


                                            <!-- ITEMS -->

                                            <h6 class="fw-bold">

                                                Items

                                            </h6>


                                            <div class="mb-4">

                                                ${a}

                                            </div>


                                            <!-- DELIVERY -->

                                            <h6 class="fw-bold">

                                                ${r.fulfillmentType===`pickup`?`Fulfilment`:`Delivery Address`}

                                            </h6>


                                            <div
                                                class="
                                                    bg-light
                                                    rounded
                                                    p-3
                                                    mb-2
                                                "
                                            >

                                                <i
                                                    class="
                                                        bi
                                                        bi-geo-alt
                                                        me-2
                                                    "
                                                ></i>


                                                ${r.fulfillmentType===`pickup`?`Customer pickup — no delivery charge`:r.deliveryAddress||`No delivery address provided.`}

                                            </div>

                                        </div>


                                        <div class="modal-footer">

                                            <button
                                                type="button"
                                                class="btn btn-dark"
                                                data-bs-dismiss="modal"
                                            >

                                                Close

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        `;document.body.insertAdjacentHTML(`beforeend`,s);let c=document.getElementById(`customerOrderDetailsModal`);new n(c).show(),c.addEventListener(`hidden.bs.modal`,()=>{c.remove()},{once:!0})}catch(e){console.error(`❌ Unable to load order:`,e),e?.response?.status===401?(alert(`Your login session has expired. Please login again.`),X()):alert(e?.response?.data?.message||`Unable to load your order. Please try again.`)}})}catch(e){console.error(`❌ Application initialization failed:`,e);let t=document.querySelector(`#app`);t&&(t.innerHTML=`

                <div class="container py-5">

                    <div class="alert alert-danger">

                        <h4>
                            Unable to load NutriDust Foods
                        </h4>


                        <p class="mb-0">

                            ${e?.message||`An unexpected error occurred.`}

                        </p>

                    </div>

                </div>

            `)}}ze().then(()=>setInterval(()=>{document.hidden||S().catch(()=>{})},3e3));