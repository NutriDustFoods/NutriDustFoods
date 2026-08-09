import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./style.css";

import { Navbar } from "./components/Navbar.js";
import { Hero } from "./components/Hero.js";
import { WhyChoose } from "./components/WhyChoose.js";
import { Products } from "./components/Products.js";
import { Stats } from "./components/Stats.js";
import { ProductModal } from "./components/ProductModal.js";
import { SearchBar } from "./components/SearchBar.js";
import { CategoryFilter } from "./components/CategoryFilter.js";
import { Cart } from "./components/Cart.js";
import { Checkout } from "./components/Checkout.js";

import { showProduct } from "./utils/modal.js";
import { renderCart } from "./utils/cartUI.js";

import { getProducts } from "./services/api.js";
import { addToCart } from "./services/cartService.js";

async function init() {

    const products = await getProducts();

    document.querySelector("#app").innerHTML = `
        ${Navbar()}
        ${Hero()}
        ${WhyChoose()}
        ${SearchBar()}
        ${CategoryFilter()}
        ${await Products()}
        ${Stats()}
        ${ProductModal()}
        ${Cart()}
        ${Checkout()}
    `;

    renderCart();

    const cart = bootstrap.Offcanvas.getOrCreateInstance(
        document.getElementById("cart")
    );

    document
        .getElementById("cartButton")
        .addEventListener("click", () => {

            const modalElement =
                document.getElementById("productModal");

            // Only hide the modal if it is actually visible
            if (modalElement.classList.contains("show")) {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(modalElement);

                modalElement.addEventListener(
                    "hidden.bs.modal",
                    () => {

                        cart.show();

                    },
                    { once: true }
                );

                modal.hide();

            } else {

                cart.show();

            }

        });

    document.querySelectorAll(".view-product").forEach(button => {

        button.addEventListener("click", () => {

            const product = products.find(

                p => p._id === button.dataset.id

            );

            showProduct(product);

        });

    });

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.addEventListener("click", () => {

            const product = products.find(

                p => p._id === button.dataset.id

            );

            addToCart(product);

            renderCart();

        });

    });

    document
        .getElementById("checkoutButton")
        .addEventListener("click", () => {

            cart.hide();

            document.getElementById("checkoutTotal").textContent =
                document.getElementById("cartTotal").textContent;

            bootstrap.Modal
                .getOrCreateInstance(
                    document.getElementById("checkoutModal")
                )
                .show();

        });

}

init();