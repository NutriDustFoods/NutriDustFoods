import { getProducts } from "./Products.js";

async function loadProducts() {
    const products = await getProducts();

    console.log("🛒 Products received by main.js:", products);
}

loadProducts();