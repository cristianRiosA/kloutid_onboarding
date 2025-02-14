"use client";

import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { LazyImageRenderer } from "lazy-image-renderer";
import { useState } from "react";

import styles from "./Account.module.scss";

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
    <div className={styles.container}>
      <section>
        <LazyImageRenderer
          src="icon/Logo.svg"
          alt="KloudID Logo"
          width={200}
          height={100}
          className={styles.logo}
        />
        <h4 className={styles.heading}>
          Start growing your
          <br /> brand connections for free
        </h4>
        <span className={styles.subheading}>No credit card required.</span>
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
