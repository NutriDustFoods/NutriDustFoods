import { products } from "../data/products.js";

export function searchProducts(keyword) {

    keyword = keyword.toLowerCase();

    return products.filter(product =>

        product.name.toLowerCase().includes(keyword) ||

        product.category.toLowerCase().includes(keyword)

    );

}