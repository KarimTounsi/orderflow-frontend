
import axios from "axios";

const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL ?? "http://localhost:8081";
const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API_URL ?? "http://localhost:8082";

export const productClient = axios.create({
  baseURL: PRODUCT_API,
  headers: { "Content-Type": "application/json" },
});

export const orderClient = axios.create({
  baseURL: ORDER_API,
  headers: { "Content-Type": "application/json" },
});
