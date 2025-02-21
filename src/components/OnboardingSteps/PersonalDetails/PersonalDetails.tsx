import { useState } from "react";
import { TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { FormData } from "@/interfaces/formData";
import styles from "./PersonalDetails.module.scss";

interface PersonalDetailsProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (phoneCountryCode: string, phoneNumber: string) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  handleChange,
  handlePhoneChange,
}) => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) errorMessage = "This field is required.";
        break;
      case "email":
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          errorMessage = "Enter a valid email address.";
        break;
      case "phone":
        if (
          value.replace(/\D/g, "").length > 0 &&
          value.replace(/\D/g, "").length < 10
        )
          errorMessage = "Enter a valid phone number (min 10 digits).";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handlePhone = (value: string) => {
    if (!value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Phone is required.",
      }));
      return;
    }

    const numericValue = value.replace(/\D/g, "");
    const match = value.match(/^(\+\d{1,4})\s?/);
    const phoneCountryCode = match ? match[1] : "+1";
    let phoneNumber = numericValue.replace(
      phoneCountryCode.replace(/\D/g, ""),
      ""
    );

    phoneNumber = phoneNumber.slice(0, 10);

    if (phoneNumber.length > 0 && phoneNumber.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: "Enter a valid phone number (min 10 digits).",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }

    handlePhoneChange(phoneCountryCode, phoneNumber);
  };

  return (
    <>
      <span className={styles.informativeText}>
        Please complete your personal details.
      </span>
      <div className={styles.formGrid}>
        <TextField
          label="First name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
        />
        <TextField
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
        />
        <TextField
          label="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <MuiTelInput
          label="Phone"
          name="phone"
          value={`${formData.phoneCountryCode || "+1"} ${
            formData.phoneNumber || ""
          }`}
          onChange={handlePhone}
          defaultCountry="US"
          onBlur={() => validateField("phone", formData.phoneNumber || "")}
          error={!!errors.phone}
          helperText={errors.phone}
          required
        />
      </div>
    </>
  );
};

export default PersonalDetails;
