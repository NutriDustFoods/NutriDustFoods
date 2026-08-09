import { products } from "../data/products.js";

export function getProductById(id) {
    return products.find(product => product.id === id);
}