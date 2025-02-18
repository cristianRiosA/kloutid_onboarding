"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import StepTracker from "@/components/StepTracker";
import { LazyImageRenderer } from "lazy-image-renderer";
import { Plan } from "@/interfaces/plan";
import { FormData } from "@/interfaces/formData";
import PaymentModal from "@/components/PaymentModal/PaymentModal";
import PersonalDetails from "@/components/OnboardingSteps/PersonalDetails/PersonalDetails";
import ServiceConnection from "@/components/OnboardingSteps/ServiceConnection/ServiceConnection";
import CompanyDetails from "@/components/OnboardingSteps/CompanyDetails/CompanyDetails";
import PlanSelectionStep from "@/components/OnboardingSteps/PlanSelectionStep/PlanSelectionStep";

import styles from "./Onboarding.module.scss";

const plans: Plan[] = [
  {
    id: "standard",
    icon: "icon/Standar_plan_icon.svg",
    title: "Standar plan",
    price: "$199/mth",
    additionalCosts: "+$2/verification",
  },
  {
    id: "premium",
    icon: "icon/Standar_plan_icon.svg",
    title: "Premium Plan",
    price: "$299/mth",
    additionalCosts: "No additional costs",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    companySize: "",
    selectedPlan: "",
    creditCards: Object.fromEntries(plans.map((plan) => [plan.id, null])),
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormData = sessionStorage.getItem("onboardingFormData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("onboardingFormData", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    setCurrentStep(1);
    sessionStorage.removeItem("onboardingFormData");
  }, []);

  const steps = [
    { text: "Tell us about yourself", icon: 1 },
    { text: "Connect your services", icon: 2 },
    { text: "Tell us about your company", icon: 3 },
    { text: "Select your plan", icon: 4 },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
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

  const handlePlanSelection = (planId: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedPlan: planId,
    }));
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
        sessionStorage.removeItem("onboardingFormData");
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
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetails formData={formData} handleChange={handleChange} />
        );
      case 2:
        return <ServiceConnection />;
      case 3:
        return (
          <CompanyDetails formData={formData} handleChange={handleChange} />
        );
      case 4:
        return (
          <PlanSelectionStep
            formData={formData}
            handlePlanSelection={handlePlanSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <LazyImageRenderer
        src="icon/Logo.svg"
        alt="KloudID Logo"
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

      <div className={styles.contentSection}>{renderStepContent()}</div>

      <div className={styles.buttonGroup}>
        {currentStep > 1 && (
          <button
            className={clsx(styles.button, styles.prevBtn)}
            onClick={handlePrevious}
          >
            Back
          </button>
        )}
        <button
          className={clsx(styles.button, styles.nextBtn)}
          onClick={handleNext}
          disabled={currentStep === steps.length && !isPaymentComplete}
        >
          Continue
        </button>
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
