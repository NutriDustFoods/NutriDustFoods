import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =====================================================
// ADMIN LOGIN
// =====================================================

export function AdminLogin() {

    return `

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

    `;

}


// =====================================================
// CHECK LOGIN
// =====================================================

export function isAdminLoggedIn() {

    const token =
        localStorage.getItem(
            "nutridust-admin-token"
        );

    return Boolean(token);

}


// =====================================================
// LOGIN
// =====================================================

export async function loginAdmin(
    username,
    password
) {

    const response =
        await API.post(
            "/admin/login",
            {
                username,
                password
            }
        );


    const data =
        response.data;


    if (
        !data ||
        !data.success ||
        !data.token
    ) {

        throw new Error(
            data?.message ||
            "Login failed."
        );

    }


    localStorage.setItem(
        "nutridust-admin-token",
        data.token
    );


    localStorage.setItem(
        "nutridust-admin-user",
        JSON.stringify(
            data.admin
        )
    );


    return data;

}


// =====================================================
// LOGOUT
// =====================================================

export function logoutAdmin() {

    localStorage.removeItem(
        "nutridust-admin-token"
    );

    localStorage.removeItem(
        "nutridust-admin-user"
    );

    window.location.href =
        "/admin.html";

}