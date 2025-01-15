import axios from "axios";
import {
  CART_URL,
  PRODUCTS_URL,
  LOGIN_URL,
  SIGNUP_URL,
  WISHLIST_URL,
  CATEGORIES_URL,
} from "./apiUrls";

const gatewayUrl = "https://3zsb71e55l.execute-api.us-east-1.amazonaws.com";

export const loginService = (email, password) =>
  axios.post(LOGIN_URL, { email, password });

export const signupService = (username, email, password) =>
  axios.post(`${gatewayUrl}/signup`, { username, email, password });

export const getAllProductsService = () => axios.get(`${gatewayUrl}/products`);

export const getProductByIdService = (productId) =>
  axios.get(`${PRODUCTS_URL}/${productId}`);

export const getCartItemsService = (email) =>
  axios.post(`${gatewayUrl}/fetchCart`, { email });

export const postAddProductToCartService = (product, token, email) =>
  axios.post(
    `${gatewayUrl}/addToCart`,
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
  axios.post(`${gatewayUrl}/deleteFromCart`, { productId, email });

export const getWishlistItemsService = (email) =>
  axios.post(`${gatewayUrl}/fetchWishlist`, { email });

export const postAddProductToWishlistService = (product, email) =>
  axios.post(`${gatewayUrl}/addToWishlist`, { product, email });

export const deleteProductFromWishlistService = (productId, email) =>
  axios.post(`${gatewayUrl}/deleteFromWishlist`, { productId, email });

export const getAllCategoriesService = () =>
  axios.get(`${gatewayUrl}/categories`);
