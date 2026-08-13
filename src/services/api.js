import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =====================================================
// GET PRODUCTS
// =====================================================

export const getProducts = async () => {

    const { data } =
        await API.get("/products");

    return data;

};


// =====================================================
// CREATE ORDER
// =====================================================

export const createOrder = async (orderData) => {

    const { data } =
        await API.post(
            "/orders",
            orderData
        );

    return data;

};


// =====================================================
// INITIALIZE PAYSTACK PAYMENT
// =====================================================

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


// =====================================================
// VERIFY PAYSTACK PAYMENT
// =====================================================

export const verifyPayment = async (reference) => {

    const { data } =
        await API.get(
            `/payments/verify/${encodeURIComponent(reference)}`
        );

    return data;

};