import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";

import styles from "./CompanyDetails.module.scss";

interface CompanyDetailsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  formData,
  handleChange,
}) => {
  const [errors, setErrors] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
  });

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "companyName":
        if (!value.trim()) errorMessage = "Company name is required.";
        break;
      case "companyWebsite":
        if (!/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)\S*$/.test(value)) {
          errorMessage = "Enter a valid URL (e.g., https://example.com).";
        }
        break;
      case "companySize":
        if (!value) errorMessage = "Select a company size.";
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

  return (
    <>
      <span className={styles.informativeText}>
        Enter your brand details to start offering discounts to content creators
      </span>
      <div className={styles.aboutCompanyGrid}>
        <TextField
          label="Company name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.companyName}
          helperText={errors.companyName}
          required
        />
        <TextField
          label="Company website"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.companyWebsite}
          helperText={errors.companyWebsite}
          required
        />
        <TextField
          select
          label="Select company size"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!errors.companySize}
          helperText={errors.companySize}
          required
          className={styles.companySize}
        >
          <MenuItem value="1-10">1-10 employees</MenuItem>
          <MenuItem value="101-300">101-300 employees</MenuItem>
          <MenuItem value="301-500">301-500 employees</MenuItem>
        </TextField>
      </div>
      <span className={styles.guieWebSiteText}>
        You can find it in the settings of your Shopify store, e.g.,
        brand.myshopify.com
      </span>
    </>
  );
};

export default CompanyDetails;
