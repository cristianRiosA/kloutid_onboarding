import { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import styles from "./ShopifyInstallModal.module.scss";

interface ShopifyInstallModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (shopDomain: string) => void;
}

const ShopifyInstallModal: React.FC<ShopifyInstallModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [shopDomain, setShopDomain] = useState("");
  const [error, setError] = useState("");

  const shopifyDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;

  const handleConfirm = () => {
    if (shopifyDomainRegex.test(shopDomain.trim())) {
      setError("");
      onConfirm(shopDomain.trim());
    } else {
      setError("Invalid Shopify domain. Format: mystore.myshopify.com");
    }
  };

  return (
    <Dialog className={styles.modalContent} open={open} onClose={onClose}>
      <DialogTitle>
        <span>
          Enter your Shopify store domain to proceed with the installation.
        </span>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Shopify Domain"
          placeholder="mystore.myshopify.com"
          value={shopDomain}
          onChange={(e) => {
            setShopDomain(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className={styles.cancelModalButtom}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          className={styles.continueModalButtom}
          disabled={!shopDomain.trim() || !!error}
        >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShopifyInstallModal;
