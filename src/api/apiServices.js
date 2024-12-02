import axios from "axios";
import {
  CART_URL,
  PRODUCTS_URL,
  LOGIN_URL,
  SIGNUP_URL,
  WISHLIST_URL,
  CATEGORIES_URL,
} from "./apiUrls";

export const loginService = (email, password) =>
  axios.post(LOGIN_URL, { email, password });

export const signupService = (username, email, password) =>
  axios.post(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/signup",
    { username, email, password }
  );

export const getAllProductsService = () =>
  axios.get(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/products"
  );

export const getProductByIdService = (productId) =>
  axios.get(`${PRODUCTS_URL}/${productId}`);

export const getCartItemsService = (email) =>
  axios.post(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/fetchCart",
    { email }
  );

export const postAddProductToCartService = (product, token, email) =>
  axios.post(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/addToCart",
    { email, product },
    {
      headers: {
        authorization: token,
      },
    }
  );

export const postUpdateProductQtyCartService = (productId, type, token) =>
  axios.post(
    `${CART_URL}/${productId}`,
    {
      action: {
        type,
      },
    },
    {
      headers: {
        authorization: token,
      },
    }
  );

export const deleteProductFromCartService = (productId, email) =>
  axios.post(
    `${"https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/deleteFromCart"}`,
    { productId, email }
  );

export const getWishlistItemsService = (email) =>
  axios.post(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/fetchWishlist",
    { email }
  );

export const postAddProductToWishlistService = (product, email) =>
  axios.post(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/addToWishlist",
    { product, email }
  );

export const deleteProductFromWishlistService = (productId, email) =>
  axios.post(
    `${"https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/deleteFromWishlist"}`,
    { productId, email }
  );

export const getAllCategoriesService = () =>
  axios.get(
    "https://qwityatxn0.execute-api.us-east-1.amazonaws.com/dev/categories"
  );
