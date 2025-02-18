import React from "react";
import { TextField } from "@mui/material";
import { FormData } from "@/interfaces/formData";

import styles from "./PersonalDetails.module.scss";

interface PersonalDetailsProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  handleChange,
}) => {
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
          required
        />
        <TextField
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
};

export default PersonalDetails;
