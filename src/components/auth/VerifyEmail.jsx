import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userPool } from "../../utils/cognito";
import { notify } from "../../utils/utils";
import { CognitoUser } from "amazon-cognito-identity-js";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    setVerifying(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const cognitoUser = new CognitoUser({
      Username: userInfo?.email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.log(err);
        notify("error", err.message || "Failed to verify email");
        setVerifying(false);
        return;
      }
      notify("success", "Email verified successfully!");
      setVerifying(false);
      navigate("/login"); // Redirect to login page after successful verification
    });
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
      />
      <button onClick={handleVerify} disabled={verifying}>
        {verifying ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default VerifyEmail;
