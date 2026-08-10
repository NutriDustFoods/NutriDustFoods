import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// Get all products
export const getProducts = async () => {

    const { data } =
        await API.get("/products");

    return data;

};


// Create a new order
export const createOrder = async (orderData) => {

    const { data } =
        await API.post(
            "/orders",
            orderData
        );

    return data;

};


// Initialize Paystack payment
export const initializePayment = async (orderId) => {

    const { data } =
        await API.post(
            "/payments/initialize",
            {
                orderId
            }
        );

    return data;

};