"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
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

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(cardNumber);
    onClose();
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
          sx={{ gridColumn: "span 2" }}
        />
        <TextField
          label="Card number"
          required
          onChange={handleCardChange}
          sx={{ gridColumn: "span 2" }}
        />
        <TextField label="Expiration date" required />
        <TextField label="Security code" required />
      </DialogContent>
      <DialogActions>
        <Button
          className={styles.cancelModalButtom}
          onClick={onClose}
          variant="text"
        >
          cancel
        </Button>
        <Button
          className={styles.continueModalButtom}
          onClick={handleSubmit}
          variant="contained"
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
