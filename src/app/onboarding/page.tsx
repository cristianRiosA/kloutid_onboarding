"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./Onboarding.module.scss";
import StepTracker from "@/components/StepTracker";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    setCurrentStep(1);
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
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInstall = () => {
    setShowInstallButton(true);
    setTimeout(() => {
      setShowInstallButton(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
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
          <p className={styles.stepContent}>Complete your personal details.</p>
        )}
        {currentStep === 2 && (
          <p className={styles.stepContent}>
            Integrate your services seamlessly.
          </p>
        )}
        {currentStep === 3 && (
          <p className={styles.stepContent}>
            Enter your brand details to start offering discounts.
          </p>
        )}
        {currentStep === 4 && (
          <p className={styles.stepContent}>
            Select your plan and activate your account.
          </p>
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

        {currentStep === 2 && !showInstallButton ? (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleInstall}
          >
            Install
          </button>
        ) : (
          <button
            className={clsx(styles.button, styles.nextBtn)}
            onClick={handleNext}
            disabled={currentStep === steps.length}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
