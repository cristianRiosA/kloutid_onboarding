"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
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
    formValues.email.trim() !== "" &&
    formValues.password.trim() !== "" &&
    formValues.confirmPassword.trim() !== "" &&
    formValues.terms;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4 className={styles.heading}>
          Start growing your
          <br /> brand connections for free
        </h4>
        <span className={styles.subheading}>No credit card required.</span>
        <span className={styles.signUpTitle}>Sign up</span>
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

          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            required
            fullWidth
            margin="normal"
            className={styles.input}
            value={formValues.confirmPassword}
            onChange={handleChange}
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

        <Button variant="outlined" fullWidth className={styles.googleButton}>
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
