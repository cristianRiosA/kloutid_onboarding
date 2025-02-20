"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import StepTracker from "@/components/StepTracker";
import { LazyImageRenderer } from "lazy-image-renderer";
import { FormData } from "@/interfaces/formData";
import PaymentModal from "@/components/PaymentModal/PaymentModal";
import PersonalDetails from "@/components/OnboardingSteps/PersonalDetails/PersonalDetails";
import ServiceConnection from "@/components/OnboardingSteps/ServiceConnection/ServiceConnection";
import CompanyDetails from "@/components/OnboardingSteps/CompanyDetails/CompanyDetails";
import PlanSelectionStep from "@/components/OnboardingSteps/PlanSelectionStep/PlanSelectionStep";

import styles from "./Onboarding.module.scss";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isShopifyInstalling, setIsShopifyInstalling] = useState(false);
  const [isShopifyInstalled, setIsShopifyInstalled] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    selectedPlan: "",
    creditCards: {},
  });

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
      if (!formData.phone || formData.phone.length < 10)
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

  const handleInstallShopify = async () => {
    setIsShopifyInstalling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulación de instalación
      setIsShopifyInstalled(true);
    } catch (error) {
      console.error("Error installing Shopify", error);
    } finally {
      setIsShopifyInstalling(false);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
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

  const handlePhoneChange = (value: string | undefined) => {
    if (!value) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        phone: "",
      }));
      return;
    }

    const numericValue = value.replace(/\D/g, "");
    const match = value.match(/^(\+\d{1,4})\s?/);
    const countryCode = match ? match[1] : "";

    const nationalNumber = numericValue.replace(
      countryCode.replace(/\D/g, ""),
      ""
    );

    const truncatedNationalNumber = nationalNumber.slice(0, 10);
    const formattedPhone = countryCode + " " + truncatedNationalNumber;

    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: formattedPhone.trim(),
    }));
  };

  const handlePlanSelection = (planId: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedPlan: planId,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, selectedPlan: "" }));
    setPaymentModalOpen(true);
  };

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
    console.log("Submitting Data:", formData);
    try {
      const response = await fetch("https://api.example.com/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Onboarding completed successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyName: "",
          companyWebsite: "",
          companySize: "",
          selectedPlan: "",
          creditCards: {},
        });
        setCurrentStep(1);
      }
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
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
          />
        )}
        {currentStep === 2 && (
          <ServiceConnection isShopifyInstalling={isShopifyInstalling} />
        )}
        {currentStep === 3 && (
          <CompanyDetails formData={formData} handleChange={handleChange} />
        )}
        {currentStep === 4 && (
          <PlanSelectionStep
            formData={formData}
            handlePlanSelection={handlePlanSelection}
          />
        )}
        {errors.selectedPlan && (
          <p className={styles.errorText}>{errors.selectedPlan}</p>
        )}
      </div>

      {/* <div className={styles.buttonGroup}>
        {currentStep > 1 && (
          <button
            className={clsx(styles.button, styles.prevBtn)}
            onClick={() => setCurrentStep(currentStep - 1)}
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
              Continue
            </button>
          ) : (
            <button
              className={clsx(styles.button, styles.installBtn)}
              onClick={handleInstallShopify}
              disabled={isShopifyInstalling}
            >
              Install Shopify
            </button>
          )
        ) : (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            Continue
          </button>
        )}
      </div> */}
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
              Continue
            </button>
          ) : (
            <button
              className={clsx(styles.button, styles.nextBtn)}
              onClick={handleInstallShopify}
              disabled={isShopifyInstalling}
            >
              Install
            </button>
          )
        ) : currentStep === 4 ? (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleSubmit}
            disabled={isNextDisabled}
          >
            Continue
          </button>
        ) : (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            Continue
          </button>
        )}
      </div>
      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
}
