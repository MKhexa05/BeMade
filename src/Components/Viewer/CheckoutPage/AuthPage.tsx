import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutLogin from "./CheckoutLogin";
import CheckoutSignup from "./CheckoutSignup";
import { setUserAuthenticated } from "../../../Utils/auth";

type AuthMode = "login" | "signup";

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");

  const handleSuccess = () => {
    setUserAuthenticated(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="h-[72px] bg-white border-b border-gray-200 flex items-center px-4 lg:px-8">
        <img
          src="/assets/images/header_logo.svg"
          alt="BeMade"
          className="h-10 w-auto object-contain"
        />
      </div>
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-10">
        {mode === "login" ? (
          <CheckoutLogin
            onBack={() => navigate("/")}
            onLogin={handleSuccess}
            onSwitchToSignup={() => setMode("signup")}
          />
        ) : (
          <CheckoutSignup
            onBack={() => navigate("/")}
            onSignup={handleSuccess}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
