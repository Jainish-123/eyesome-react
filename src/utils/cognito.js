import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_69EbKhdAk",
  ClientId: "2smo73b1f78h8v3ssm1nbfeclp",
};

export const userPool = new CognitoUserPool(poolData);
