"use client";

import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import styles from "./Login.module.scss";
import { LazyImageRenderer } from "lazy-image-renderer";

interface LoginProps {
  isLoading?: boolean;
  error?: boolean;
  onSubmit?: (values: { email: string; password: string }) => void;
  toggleForm?: () => void;
}

const Login: React.FC<LoginProps> = ({ error, onSubmit, toggleForm }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit({ email: formValues.email, password: formValues.password });
    }
  };

  const isFormValid =
    formValues.email.trim() !== "" && formValues.password.trim() !== "";

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4 className={styles.heading}>
          Start growing your
          <br /> brand connections for free
        </h4>
        <span className={styles.subheading}>No credit card required.</span>
        <span className={styles.loginTitle}>Sign in</span>

        <div className={styles.formContainer}>
          <TextField
            label="Email address"
            name="email"
            type="email"
            required
            fullWidth
            margin="normal"
            className={styles.input}
            value={formValues.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            required
            fullWidth
            margin="normal"
            className={styles.input}
            value={formValues.password}
            onChange={handleChange}
          />
        </div>

        {error && (
          <span color="error" className={styles.error}>
            Invalid credentials. Please try again.
          </span>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className={styles.loginButton}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : <span>Login</span>}
        </Button>

        <div className={styles.orText}>
          <span>OR</span>
        </div>

        <Button variant="outlined" className={styles.googleButton}>
          <LazyImageRenderer
            src="icon/Access_with_Google_Icon.svg"
            width={24}
            height={24}
            draggable={false}
          />
          <span>Access with Google</span>
        </Button>

        <span className={styles.signUpText}>
          Don’t have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleForm?.();
            }}
          >
            Sign Up
          </a>
        </span>
      </form>
    </div>
  );
};

export default Login;
