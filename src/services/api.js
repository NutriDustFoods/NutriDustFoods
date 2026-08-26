import axios from "axios";


// =====================================================
// API CLIENT
// =====================================================

const API = axios.create({

    baseURL:
        __API_URL__

});


// =====================================================
// CUSTOMER AUTH STORAGE
// =====================================================

const CUSTOMER_TOKEN_KEY =
    "nutridust-customer-token";


const CUSTOMER_KEY =
    "nutridust-customer";


// =====================================================
// GET SAVED CUSTOMER TOKEN
// =====================================================

export const getCustomerToken = () => {

    return localStorage.getItem(
        CUSTOMER_TOKEN_KEY
    );

};


// =====================================================
// GET SAVED CUSTOMER
// =====================================================

export const getSavedCustomer = () => {

    const customer =
        localStorage.getItem(
            CUSTOMER_KEY
        );


    if (!customer) {

        return null;

    }


    try {

        return JSON.parse(
            customer
        );

    } catch (error) {

        console.error(
            "❌ Invalid saved customer data:",
            error
        );

        return null;

    }

};


// =====================================================
// SAVE CUSTOMER LOGIN
// =====================================================

const saveCustomerLogin = (
    data
) => {

    // =================================================
    // SAVE JWT
    // =================================================

    if (
        data?.token
    ) {

        localStorage.setItem(

            CUSTOMER_TOKEN_KEY,

            data.token

        );

    }


    // =================================================
    // SAVE CUSTOMER
    // =================================================

    if (
        data?.customer
    ) {

        localStorage.setItem(

            CUSTOMER_KEY,

            JSON.stringify(
                data.customer
            )

        );

    }

};


// =====================================================
// LOGOUT CUSTOMER
// =====================================================

export const logoutCustomer = () => {

    localStorage.removeItem(
        CUSTOMER_TOKEN_KEY
    );


    localStorage.removeItem(
        CUSTOMER_KEY
    );


    console.log(
        "👋 Customer logged out."
    );

};


// =====================================================
// IS CUSTOMER LOGGED IN
// =====================================================

export const isCustomerLoggedIn = () => {

    return Boolean(
        getCustomerToken()
    );

};


// =====================================================
// ATTACH CUSTOMER JWT
// =====================================================

API.interceptors.request.use(

    config => {

        const token =
            getCustomerToken();


        if (token) {

            config.headers =
                config.headers || {};


            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    error => {

        return Promise.reject(
            error
        );

    }

);


// =====================================================
// HANDLE UNAUTHORIZED RESPONSES
// =====================================================

API.interceptors.response.use(

    response => {

        return response;

    },

    error => {

        if (
            error?.response?.status === 401
        ) {

            console.warn(
                "🔐 Customer authentication expired or is invalid."
            );


            logoutCustomer();

        }


        return Promise.reject(
            error
        );

    }

);


// =====================================================
// CUSTOMER SIGNUP
// POST /api/auth/signup
// =====================================================

export const signupCustomer = async (
    customerData
) => {

    const { data } =
        await API.post(

            "/auth/signup",

            customerData

        );


    if (
        data?.success &&
        data?.token
    ) {

        saveCustomerLogin(
            data
        );

    }


    return data;

};


// =====================================================
// CUSTOMER LOGIN
// POST /api/auth/login
// =====================================================

export const loginCustomer = async (
    email,
    password
) => {

    const { data } =
        await API.post(

            "/auth/login",

            {
                email,
                password
            }

        );


    if (

        data?.success &&

        data?.token

    ) {

        saveCustomerLogin(
            data
        );

    }


    return data;

};


// =====================================================
// GET CURRENT CUSTOMER
// GET /api/auth/me
// =====================================================

export const getCurrentCustomer = async () => {

    const { data } =
        await API.get(
            "/auth/me"
        );


    if (
        data?.success &&
        data?.customer
    ) {

        localStorage.setItem(

            CUSTOMER_KEY,

            JSON.stringify(
                data.customer
            )

        );

    }


    return data;

};


// =====================================================
// GET PRODUCTS
// GET /api/products
// =====================================================

export const getProducts = async () => {

    const { data } =
        await API.get(
            "/products"
        );


    return data;

};


// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================
//
// IMPORTANT:
//
// The frontend does NOT need to send:
//
// customerName
// customerPhone
// customerEmail
//
// The backend gets those securely from the
// authenticated customer's account.
//
// We therefore only need:
//
// deliveryAddress
// items
//
// =====================================================

export const createOrder = async (
    orderData
) => {

    const cleanOrderData = {

        deliveryAddress:
            orderData?.deliveryAddress || "",

        fulfillmentType:
            orderData?.fulfillmentType || "delivery",

        items:
            Array.isArray(
                orderData?.items
            )
                ? orderData.items
                : []

    };


    const { data } =
        await API.post(

            "/orders",

            cleanOrderData

        );


    return data;

};

export const getDeliveryQuote = async deliveryAddress => {
    const { data } = await API.post("/orders/delivery-quote", { deliveryAddress });
    return data.quote;
};


// =====================================================
// GET MY ORDERS
// GET /api/orders/my
// =====================================================
//
// Returns ONLY orders belonging to the logged-in
// customer.
//
// =====================================================

export const getMyOrders = async () => {

    const { data } =
        await API.get(
            "/orders/my"
        );


    return data;

};


// =====================================================
// INITIALIZE PAYSTACK PAYMENT
// POST /api/payments/initialize
// =====================================================

export const initializePayment = async (
    orderId
) => {

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
// GET /api/payments/verify/:reference
// =====================================================

export const verifyPayment = async (
    reference
) => {

    const { data } =
        await API.get(

            `/payments/verify/${encodeURIComponent(
                reference
            )}`

        );


    return data;

};


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================
//
// ADMIN USE ONLY.
//
// Customers should NEVER use this endpoint to
// retrieve order history.
//
// =====================================================

export const getOrders = async () => {

    const { data } =
        await API.get(
            "/orders"
        );


    return data;

};


// =====================================================
// GET SINGLE CUSTOMER ORDER
// GET /api/orders/:id
// =====================================================
//
// The backend MUST verify:
//
// order.customer_id === authenticated customer ID
//
// =====================================================

export const getOrderById = async (
    orderId
) => {

    if (!orderId) {

        throw new Error(
            "Order number is required."
        );

    }


    const { data } =
        await API.get(

            `/orders/${encodeURIComponent(
                orderId
            )}`

        );


    return data;

};


// =====================================================
// TRACK CUSTOMER ORDER
// GET /api/orders/:id/track
// =====================================================
//
// The new backend will authenticate the customer.
//
// Phone number is no longer required.
//
// We keep the second argument temporarily so existing
// frontend code does not break while we finish the
// migration.
//
// =====================================================

export const trackOrder = async (
    orderId
) => {

    if (!orderId) {

        throw new Error(
            "Order number is required."
        );

    }


    const { data } =
        await API.get(

            `/orders/${encodeURIComponent(
                orderId
            )}/track`

        );


    return data;

};


// =====================================================
// EXPORT API CLIENT
// =====================================================

export default API;
