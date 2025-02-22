"use client";

import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import StepTracker from "@/components/StepTracker";
import { LazyImageRenderer } from "lazy-image-renderer";
import { FormData } from "@/interfaces/formData";
import PaymentModal from "@/components/PaymentModal/PaymentModal";
import PersonalDetails from "@/components/OnboardingSteps/PersonalDetails/PersonalDetails";
import ServiceConnection from "@/components/OnboardingSteps/ServiceConnection/ServiceConnection";
import CompanyDetails from "@/components/OnboardingSteps/CompanyDetails/CompanyDetails";
//import PlanSelectionStep from "@/components/OnboardingSteps/PlanSelectionStep/PlanSelectionStep";
import {
  existDomain,
  updateMerchant,
  updateMerchantDataCompany,
} from "@/services/api";
import { getAuthToken } from "@/services/firebase/auth";
import ShopifyInstallModal from "@/components/ShopifyInstallModal/ShopifyInstallModal";
import { useSearchParams } from "next/navigation";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { ShopifyAuthUrl } from "@/environment";

import styles from "./Onboarding.module.scss";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const shopParam = searchParams.get("shop");

  const [currentStep, setCurrentStep] = useState(1);
  const [isShopifyInstalling, setIsShopifyInstalling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isShopifyInstalled, setIsShopifyInstalled] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [merchantError, setMerchantError] = useState<string | null>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [shopDomain, setShopDomain] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("shopDomain") : null
  );

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "",
    phoneNumber: "",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    selectedPlan: "",
    creditCards: {},
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShopDomain = localStorage.getItem("shopDomain");
      setShopDomain(storedShopDomain);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (shopParam) {
        if (shopDomain && shopDomain !== shopParam) {
          setShopDomain(null);
          localStorage.removeItem("shopDomain");
          setIsShopifyInstalled(false);
          setCurrentStep(1);
        } else {
          setShopDomain(shopParam);
          localStorage.setItem("shopDomain", shopParam);
          setIsShopifyInstalled(true);
          setCurrentStep(2);
        }
      } else if (shopDomain) {
        setIsShopifyInstalled(true);
        setCurrentStep(2);
      } else {
        setIsShopifyInstalled(false);
        setCurrentStep(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentStep === 3 && typeof window !== "undefined") {
      setShopDomain(null);
      localStorage.removeItem("shopDomain");
    }
  }, [currentStep]);

  const steps = [
    { text: "Tell us about yourself", icon: 1 },
    { text: "Connect your services", icon: 2 },
    { text: "Tell us about your company", icon: 3 },
    { text: "Select your plan", icon: 4 },
  ];

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required.";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required.";
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
        newErrors.email = "Enter a valid email.";
      if (!formData.phoneNumber || formData.phoneNumber.length < 10)
        newErrors.phone = "Enter a valid phone number (min 10 digits).";
    }

    if (currentStep === 3) {
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required.";
      if (
        !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)\S*$/.test(
          formData.companyWebsite
        )
      )
        newErrors.companyWebsite = "Enter a valid company website.";
      if (!formData.companySize)
        newErrors.companySize = "Select a company size.";
    }

    if (currentStep === 4) {
      if (!formData.selectedPlan)
        newErrors.selectedPlan = "You must select a plan.";
      if (!isPaymentComplete)
        newErrors.payment = "You must complete the payment.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData, isPaymentComplete]);

  useEffect(() => {
    setIsNextDisabled(!validateStep());
  }, [formData, isPaymentComplete, validateStep]);

  const handleInstallShopify = async (shopDomain: string) => {
    setIsShopifyInstalling(true);
    setModalOpen(false);

    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error("Failed to retrieve authentication token.");
      }
      const domainExists = await existDomain(shopDomain, authToken);
      if (!domainExists) {
        setMerchantError(
          "The provided domain does not exist on Shopify. Please check and try again."
        );

        setModalOpen(true);
        return;
      }

      if (domainExists) {
        const shopifyAuthUrl = ShopifyAuthUrl;
        window.location.href = `${shopifyAuthUrl}?shop=${shopDomain}`;
      }
    } catch (error) {
      console.error("🔴 Error installing Shopify app:", error);
      setMerchantError(
        "Something went wrong while verifying the domain. Please try again."
      );
      setModalOpen(true);
    } finally {
      setIsShopifyInstalling(false);
    }
  };

  const handleNext = async () => {
    if (validateStep()) {
      setIsNextLoading(true);
      if (currentStep === 1) {
        try {
          const authToken = await getAuthToken();
          if (!authToken) {
            throw new Error("Failed to retrieve authentication token.");
          }

          await updateMerchant(
            formData.firstName,
            formData.lastName,
            formData.phoneCountryCode,
            formData.phoneNumber,
            authToken
          );
        } catch (error) {
          console.error("🔴 Error updating merchant:", error);
          setMerchantError(
            "Something went wrong while sending the information. Please try again."
          );
          return;
        }
      }
      if (currentStep === 3) {
        try {
          const authToken = await getAuthToken();
          if (!authToken) {
            throw new Error("Failed to retrieve authentication token.");
          }

          await updateMerchantDataCompany(
            formData.companyName,
            formData.companyWebsite,
            formData.companySize,
            authToken
          );
        } catch (error) {
          console.error("🔴 Error updating merchant:", error);
          setMerchantError(
            "Something went wrong while sending the information. Please try again."
          );
          return;
        }
      }

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
      setIsNextLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  // const handlePlanSelection = (planId: string) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     selectedPlan: planId,
  //   }));
  //   setErrors((prevErrors) => ({ ...prevErrors, selectedPlan: "" }));
  //   setPaymentModalOpen(true);
  // };

  const handlePaymentSubmit = (cardNumber: string) => {
    const last4Digits = cardNumber ? cardNumber.slice(-4) : "";
    setFormData((prevFormData) => ({
      ...prevFormData,
      creditCards: {
        ...prevFormData.creditCards,
        [prevFormData.selectedPlan || ""]: { last4: last4Digits },
      },
    }));
    setIsPaymentComplete(true);
    setErrors((prevErrors) => ({ ...prevErrors, payment: "" }));
  };

  const handleSubmit = async () => {
    try {
      //TODO: temporarily commented
      // const response = await fetch("https://api.example.com/onboarding", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (response.ok) {
      //   alert("Onboarding completed successfully!");
      //   setFormData({
      //     firstName: "",
      //     lastName: "",
      //     email: "",
      //     phoneNumber: "",
      //     phoneCountryCode: "",
      //     companyName: "",
      //     companyWebsite: "",
      //     companySize: "",
      //     selectedPlan: "",
      //     creditCards: {},
      //   });
      //   setCurrentStep(1);
      // }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div className={styles.container}>
      <LazyImageRenderer
        src="icon/Logo.svg"
        alt="Logo"
        width={200}
        height={100}
        className={styles.logo}
      />
      <h2 className={styles.heading}>
        Leverage exclusive offers to connect with influencers who align with
        your brand.
      </h2>
      <p className={styles.subheading}>
        Fill in your details to connect with top creators, offer discounts, and
        elevate your brand. Unlock the power today!
      </p>

      <StepTracker
        currentStep={currentStep}
        className={styles.stepTracker}
        steps={steps}
        stepClassName={(index) =>
          clsx(styles.contentSteps, {
            [styles.complete]: index + 1 < currentStep,
            [styles.active]: index + 1 === currentStep,
          })
        }
        textClassName={(index) =>
          clsx(styles.stepText, {
            [styles.complete]: index + 1 < currentStep,
            [styles.active]: index + 1 === currentStep,
          })
        }
        iconClassName={(index) =>
          clsx(styles.stepIcon, {
            [styles.complete]: index + 1 < currentStep,
            [styles.active]: index + 1 === currentStep,
          })
        }
        separatorClassName={styles.separator}
      />

      <div className={styles.contentSection}>
        {currentStep === 1 && (
          <PersonalDetails
            formData={formData}
            handleChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            handlePhoneChange={(phoneCountryCode, phoneNumber) =>
              setFormData((prev) => ({
                ...prev,
                phoneCountryCode,
                phoneNumber,
              }))
            }
          />
        )}
        {currentStep === 2 && (
          <ServiceConnection isShopifyInstalling={isShopifyInstalling} />
        )}
        {currentStep === 3 && (
          <CompanyDetails formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 4 && (
          // <PlanSelectionStep
          //   formData={formData}
          //   handlePlanSelection={handlePlanSelection}
          // />
          <span>cooming soon..</span>
        )}
        {errors.selectedPlan && (
          <p className={styles.errorText}>{errors.selectedPlan}</p>
        )}
      </div>
      <div className={styles.buttonGroup}>
        {currentStep > 1 && (
          <button
            className={clsx(styles.button, styles.prevBtn)}
            onClick={handlePrevious}
          >
            Back
          </button>
        )}

        {currentStep === 2 ? (
          isShopifyInstalled ? (
            <button
              className={clsx(styles.button, styles.nextBtn)}
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              {isNextLoading ? <CircularProgress size={24} /> : "Continue"}
            </button>
          ) : (
            <button
              className={clsx(styles.button, styles.nextBtn)}
              disabled={isShopifyInstalling || isShopifyInstalled}
              onClick={() => setModalOpen(true)}
            >
              {isShopifyInstalling ? "Installing..." : "Install"}
            </button>
          )
        ) : currentStep === 4 ? (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleSubmit}
            disabled={isNextDisabled}
          >
            {isNextLoading ? <CircularProgress size={24} /> : "Continue"}
          </button>
        ) : (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {isNextLoading ? <CircularProgress size={24} /> : "Continue"}
          </button>
        )}
        <Snackbar
          open={!!merchantError}
          autoHideDuration={6000}
          onClose={() => setMerchantError(null)}
        >
          <Alert severity="error" onClose={() => setMerchantError(null)}>
            {merchantError}
          </Alert>
        </Snackbar>
      </div>
      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}
      {modalOpen && (
        <ShopifyInstallModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleInstallShopify}
        />
      )}
    </div>
  );
}
