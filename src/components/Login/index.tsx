"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  loginWithEmail,
  // loginWithGoogle
} from "@/services/firebase/auth";
import { LazyImageRenderer } from "lazy-image-renderer";
import { useRouter } from "next/navigation";

import styles from "./Login.module.scss";

interface LoginProps {
  isLoading?: boolean;
  error?: boolean;
  toggleForm?: () => void;
}

const Login: React.FC<LoginProps> = ({ error, toggleForm }) => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await loginWithEmail(formValues.email, formValues.password);
      router.push("/onboarding");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSubmitting(false);

      let errorMessage = "Failed to login. Please check your credentials.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Try again.";
      }

      setAuthError(errorMessage);
    }
  };

  const isFormValid =
    formValues.email.trim() !== "" && formValues.password.trim() !== "";

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
            autoComplete="email"
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
            autoComplete="current-password"
            slotProps={{
              input: {
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
              },
            }}
          />
        </div>

        {authError && (
          <Alert severity="error" className={styles.error}>
            {authError}
          </Alert>
        )}
        {error && (
          <Alert severity="error" className={styles.error}>
            Invalid credentials. Please try again.
          </Alert>
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
          {isSubmitting ? <CircularProgress size={24} /> : <span>Log in</span>}
        </Button>

        <div className={styles.orText}>
          <span>OR</span>
        </div>

        <Button
          variant="outlined"
          className={styles.googleButton}
          //TODO: temporarily commented
          // onClick={loginWithGoogle}
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
