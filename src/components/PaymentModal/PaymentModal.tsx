"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./PaymentModal.module.scss";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cardNumber: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const formatExpirationDate = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned.slice(0, 5);
  };

  const handleExpirationDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExpirationDate(formatExpirationDate(e.target.value));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name on card is required";
    if (
      cardNumber.replace(/\s/g, "").length < 13 ||
      cardNumber.replace(/\s/g, "").length > 19
    ) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expirationDate)) {
      newErrors.expirationDate = "Invalid expiration date (MM/YY)";
    }
    if (securityCode.length < 3 || securityCode.length > 4) {
      newErrors.securityCode = "Invalid security code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(cardNumber.replace(/\s/g, ""));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.modalPayment}>
      <DialogTitle>
        <span className={styles.titleModal}>Set up your Payment Method</span>
        <span className={styles.subTitleModal}>
          Add a payment method to activate your account and start offering
          discounts to content creators.
        </span>
      </DialogTitle>
      <DialogContent
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
      >
        <TextField
          label="Name on card"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Card number"
          required
          value={cardNumber}
          onChange={handleCardChange}
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Expiration date (MM/YY)"
          required
          value={expirationDate}
          onChange={handleExpirationDateChange}
          error={!!errors.expirationDate}
          helperText={errors.expirationDate}
        />
        <TextField
          label="Security code"
          required
          type={showSecurityCode ? "text" : "password"}
          value={securityCode}
          onChange={(e) =>
            setSecurityCode(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          error={!!errors.securityCode}
          helperText={errors.securityCode}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSecurityCode(!showSecurityCode)}
                  >
                    {showSecurityCode ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.cancelModalButtom}
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          className={styles.continueModalButtom}
          onClick={handleSubmit}
          variant="contained"
          disabled={Object.keys(errors).length > 0}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
