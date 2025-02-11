import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to KloudID</h1>
        <p className={styles.description}>
          We are excited to have you on board. Below you can start the process
          of setting up your account.
        </p>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 KloudID. All rights reserved.</p>
      </footer>
    </div>
  );
}
