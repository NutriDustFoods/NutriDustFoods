import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export const getProducts = async () => {
    const { data } = await API.get("/products");
    return data;
};

export const createOrder = async (orderData) => {
    const { data } = await API.post("/orders", orderData);
    return data;
};