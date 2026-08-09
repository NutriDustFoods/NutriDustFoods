import { Products } from "../components/Products.js";

export function renderProducts() {

    const section = document.getElementById("products");

    if(section){

        section.outerHTML = Products();

    }

}