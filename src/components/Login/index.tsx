"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "email") {
      setEmailError(
        validateEmail(value) ? "" : "Please enter a valid email address."
      );
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit({ email: formValues.email, password: formValues.password });
    }
  };

  const isFormValid =
    formValues.email.trim() !== "" &&
    formValues.password.trim() !== "" &&
    emailError === "";

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.loginTitle}>Log in</span>
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
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            margin="normal"
            className={styles.input}
            value={formValues.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {error && (
          <span color="error" className={styles.error}>
            Invalid credentials. Please try again.
          </span>
        )}

        <Button type="button" className={styles.forgotPassword}>
          <span> Forgot your password?</span>
        </Button>
        <Button
          type="submit"
          variant="contained"
          className={styles.loginButton}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : <span>log in</span>}
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
