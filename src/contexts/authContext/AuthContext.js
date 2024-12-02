import { createContext, useState } from "react";
// import { loginService, signupService } from "../../api/apiServices"; // Commented out older service imports
import { notify } from "../../utils/utils";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { userPool } from "../../utils/cognito";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const signupHandler = async ({
    username = "",
    email = "",
    password = "",
  }) => {
    setSigningUp(true);

    // Older code for signupService
    // try {
    //   const response = await signupService(username, email, password);
    //   console.log(response);
    //   if (response.status === 200 || response.status === 201) {
    //     localStorage.setItem("token", response?.data?.encodedToken);
    //     localStorage.setItem(
    //       "userInfo",
    //       JSON.stringify(response?.data?.createdUser)
    //     );
    //     setToken(response?.data?.encodedToken);
    //     notify("success", "Signed Up Successfully!!");
    //   }
    // } catch (err) {
    //   console.log(err);
    //   notify(
    //     "error",
    //     err?.response?.data?.errors
    //       ? err?.response?.data?.errors[0]
    //       : "Some Error Occurred!!"
    //   );
    // } finally {
    //   setSigningUp(false);
    // }

    // New Cognito Signup Code
    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        notify("error", err.message || "Some error occurred during signup");
        setSigningUp(false);
        return;
      }
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ email: result.user.getUsername() })
      );
      notify(
        "success",
        "Signed Up Successfully! Check your email for the verification code."
      );
      setSigningUp(false);
      // navigate("/verify-code");
    });
  };

  const loginHandler = async ({ email = "", password = "" }) => {
    setLoggingIn(true);

    // Older code for loginService
    // try {
    //   const response = await loginService(email, password);
    //   console.log({ response });
    //   if (response.status === 200 || response.status === 201) {
    //     localStorage.setItem("token", response?.data?.encodedToken);
    //     localStorage.setItem(
    //       "userInfo",
    //       JSON.stringify(response?.data?.foundUser)
    //     );
    //     setToken(response?.data?.encodedToken);
    //     notify("success", "Logged In Successfully!!");
    //   }
    // } catch (err) {
    //   console.log(err);
    //   notify(
    //     "error",
    //     err?.response?.data?.errors
    //       ? err?.response?.data?.errors[0]
    //       : "Some Error Occurred!!"
    //   );
    // } finally {
    //   setLoggingIn(false);
    // }

    // New Cognito Login Code
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    // console.log(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userInfo", JSON.stringify({ email, idToken }));
        setToken(accessToken);
        notify("success", "Logged in successfully!!");
        setLoggingIn(false);
      },
      onFailure: (err) => {
        console.log(err);
        notify("error", err.message || "Login failed");
        setLoggingIn(false);
      },
    });
  };

  const logoutHandler = () => {
    // Clear the session for Cognito user (optional)
    if (userInfo?.username) {
      const cognitoUser = new CognitoUser({
        Username: userInfo.email,
        Pool: userPool,
      });
      cognitoUser.signOut();
    }

    // Older logout code
    // localStorage.removeItem("token");
    // localStorage.removeItem("userInfo");
    // setToken(null);
    // notify("info", "Logged out successfully!!", 100);

    // Updated logout handler
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    notify("info", "Logged out successfully!!", 100);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        loggingIn,
        loginHandler,
        logoutHandler,
        signupHandler,
        signingUp,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
