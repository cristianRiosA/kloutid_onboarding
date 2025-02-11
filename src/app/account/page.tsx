"use client";

import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState } from "react";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  function handleSignUp(values: { email: string; password: string }) {
    console.log("SignUp submitted with", values);
  }

  function handleLogin(values: { email: string; password: string }) {
    console.log("Login submitted with", values);
  }

  return (
    <div>
      <section>
        {isLogin ? (
          <Login
            onSubmit={handleLogin}
            isLoading={false}
            error={false}
            toggleForm={toggleForm}
          />
        ) : (
          <SignUp
            onSubmit={handleSignUp}
            isLoading={false}
            error={false}
            toggleForm={toggleForm}
          />
        )}
      </section>
    </div>
  );
}
