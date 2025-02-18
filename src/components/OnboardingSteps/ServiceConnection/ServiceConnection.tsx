import React from "react";
import { LazyImageRenderer } from "lazy-image-renderer";

import styles from "./ServiceConnection.module.scss";

const ServiceConnection = () => {
  return (
    <>
      <span className={styles.informativeText}>
        Unlock the full potential of your site by connecting with us. This
        integration allows you to display exclusive offers for influencers,
        increasing your brand&apos;s reach and revenue.
      </span>
      <div className={styles.logoInstallButton}>
        <LazyImageRenderer
          src="icon/Card_platform_connect_shopify.svg"
          alt="Install Shopify"
          width={126.593}
          height={36.064}
        />
      </div>
    </>
  );
};

export default ServiceConnection;
