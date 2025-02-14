"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LazyImageRenderer } from "lazy-image-renderer";
import styles from "./SignUp.module.scss";

interface SignUpProps {
  isLoading?: boolean;
  error?: boolean;
  onSubmit?: (values: { email: string; password: string }) => void;
  toggleForm?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ error, onSubmit, toggleForm }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "email") {
      setEmailError(
        validateEmail(value) ? "" : "Please enter a valid email address."
      );
    }

    if (name === "password" || name === "confirmPassword") {
      setPasswordError(
        formValues.password !== value && name === "confirmPassword"
          ? "Passwords do not match."
          : ""
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
    formValues.confirmPassword.trim() !== "" &&
    formValues.terms &&
    emailError === "" &&
    passwordError === "" &&
    formValues.password === formValues.confirmPassword;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.signUpTitle}>Sign up</span>
        <div className={styles.formContainer}>
          <TextField
            label="Email address"
            name="email"
            type="email"
            required
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
            className={styles.input}
            value={formValues.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className={styles.input}
            value={formValues.confirmPassword}
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <FormControlLabel
          className={styles.formControlLabel}
          control={
            <Checkbox
              name="terms"
              className={styles.checkbox}
              checked={formValues.terms}
              onChange={handleChange}
            />
          }
          label={
            <span className={styles.termsText}>
              Creating an account means you’re okay with our&nbsp;
              <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>.
            </span>
          }
        />
        {error && (
          <span color="error" className={styles.error}>
            Something went wrong. Please try again.
          </span>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className={styles.registerButton}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            <span>Register</span>
          )}
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

        <span className={styles.loginText}>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleForm?.();
            }}
          >
            Log In
          </a>
        </span>
      </form>
    </div>
  );
};

export default SignUp;
