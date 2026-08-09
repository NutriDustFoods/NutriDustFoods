import logo from "../assets/logo/logo.png";

export function Navbar() {

    return `

<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">

    <div class="container">

        <a
            class="navbar-brand d-flex align-items-center"
            href="#">

            <img
                src="${logo}"
                alt="NutriDust Foods"
                class="navbar-logo me-3">

            <div>

                <h2 class="m-0 text-warning fw-bold">
                    NutriDust Foods
                </h2>

                <small class="text-secondary">
                    Premium Nutrition
                </small>

            </div>

        </a>

        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation">

            <span class="navbar-toggler-icon"></span>

        </button>

        <div
            class="collapse navbar-collapse"
            id="navbarMenu">

            <ul class="navbar-nav ms-auto align-items-lg-center">

                <li class="nav-item">
                    <a class="nav-link active" href="#">
                        Home
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#products">
                        Products
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">
                        Nutrition
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">
                        Recipes
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="#">
                        Contact
                    </a>
                </li>

                <li class="nav-item ms-lg-4">

                    <button
                        id="cartButton"
                        type="button"
                        class="btn btn-warning position-relative">

                        <i class="bi bi-cart3 fs-4"></i>

                        <span
                            id="cartCount"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">

                            0

                        </span>

                    </button>

                </li>

            </ul>

        </div>

    </div>

</nav>

`;

}