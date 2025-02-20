"use client";

import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { useState } from "react";
import styles from "./Account.module.scss";
import { LazyImageRenderer } from "lazy-image-renderer";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className={styles.container}>
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
        <Login toggleForm={toggleForm} />
      ) : (
        <SignUp toggleForm={toggleForm} />
      )}
    </div>
  );
}
