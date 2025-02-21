"use client";

import { LazyImageRenderer } from "lazy-image-renderer";

import styles from "./ServiceConnection.module.scss";

interface ServiceConnectionProps {
  isShopifyInstalling: boolean;
}

const ServiceConnection: React.FC<ServiceConnectionProps> = ({
  isShopifyInstalling,
}) => {
  return (
    <div className={styles.container}>
      <span className={styles.informativeText}>
        Unlock the full potential of your site by connecting with us. This
        integration allows you to display exclusive offers for influencers,
        increasing your brand&apos;s reach and revenue.
      </span>
      {isShopifyInstalling && (
        <div className={styles.alertInformative}>
          <LazyImageRenderer
            src="icon/alert_Icon.svg"
            alt="Install Shopify"
            width={22}
            height={22}
          />
          <div>
            <span className={styles.alertTitle}>We&apos;re almost there!</span>
            <span className={styles.alertMessage}>
              Please wait as we finalize the connection to your account.
            </span>
          </div>
        </div>
      )}

      <div className={styles.logoInstallButton}>
        <LazyImageRenderer
          src="icon/Card_platform_connect_shopify.svg"
          alt="Install Shopify"
          width={126.593}
          height={36.064}
        />
      </div>
    </div>
  );
};

export default ServiceConnection;
