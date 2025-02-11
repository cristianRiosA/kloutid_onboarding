"use client";

import { LazyImageRenderer } from "lazy-image-renderer";
import styles from "./Home.module.scss";

export default function Home() {
  const handleButtonClick = (url: string) => {
    window.location.href = url;
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <LazyImageRenderer
          src="icon/Logo.svg"
          alt="KloudID Logo"
          width={200}
          height={100}
        />
        <h1 className={styles.title}>Welcome to KloudID</h1>
        <p className={styles.description}>
          We are excited to have you on board. Below you can start the process
          of setting up your account.
        </p>
        <div className={styles.buttonContainer}>
          <button
            onClick={() =>
              handleButtonClick("https://kloutidonboarding.vercel.app/account")
            }
            className={styles.button}
          >
            Get Started
          </button>
          <button
            onClick={() =>
              handleButtonClick(
                "https://kloutidonboarding.vercel.app/onboarding"
              )
            }
            className={styles.button}
          >
            onboarding
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 KloudID. All rights reserved.</p>
      </footer>
    </div>
  );
}
