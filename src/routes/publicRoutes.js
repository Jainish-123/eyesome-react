import Mockman from "mockman-js";

import { Login, ProductDetails, ProductListing, Signup } from "../pages";

// import { VerifyEmail } from "../components/auth/VerifyEmail";

import VerifyEmail from "../components/auth/VerifyEmail";

const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-code",
    element: <VerifyEmail />,
  },
];

const contentRoutes = [
  {
    path: "/products",
    element: <ProductListing />,
  },

  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },

  {
    path: "/mockman",
    element: <Mockman />,
  },
];
export { authRoutes, contentRoutes };
