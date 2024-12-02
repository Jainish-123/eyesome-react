import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_dPvQqr8ne",
  ClientId: "2e8hi8r60ctddj57h5rcislrug",
};

export const userPool = new CognitoUserPool(poolData);
