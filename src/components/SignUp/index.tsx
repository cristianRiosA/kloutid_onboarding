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
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LazyImageRenderer } from "lazy-image-renderer";
import styles from "./SignUp.module.scss";
import { registerWithEmail } from "@/firebase/auth";

interface SignUpProps {
  isLoading?: boolean;
  error?: boolean;
  toggleForm?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ error, toggleForm }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    if (formValues.password !== formValues.confirmPassword) {
      setAuthError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await registerWithEmail(formValues.email, formValues.password);
      toggleForm?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSubmitting(false);
      setAuthError(
        error.code === "auth/email-already-in-use"
          ? "This email is already in use."
          : "Failed to create account. Please try again."
      );
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
            autoComplete="email"
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={styles.input}
            value={formValues.password}
            onChange={handleChange}
            autoComplete="new-password"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
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
            autoComplete="new-password"
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
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

        {authError && (
          <Alert severity="error" className={styles.error}>
            {authError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" className={styles.error}>
            Something went wrong. Please try again.
          </Alert>
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

        <Button
          variant="outlined"
          className={styles.googleButton}
          disabled={isSubmitting}
        >
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
