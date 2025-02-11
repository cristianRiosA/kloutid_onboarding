"use client";

import React from "react";

import clsx from "clsx";

interface Step {
  text: string;
  icon: number;
}

interface StepTrackerProps {
  currentStep: number;
  steps: Step[];
  className?: string;
  stepClassName?:
    | string
    | ((index: number, isActive: boolean, isCompleted: boolean) => string);
  textClassName?:
    | string
    | ((index: number, isActive: boolean, isCompleted: boolean) => string);
  iconClassName?:
    | string
    | ((index: number, isActive: boolean, isCompleted: boolean) => string);
  separatorClassName?: string;
}

const StepTracker: React.FC<StepTrackerProps> = ({
  currentStep,
  steps,
  className,
  stepClassName,
  textClassName,
  iconClassName,
  separatorClassName,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep; // Pasos anteriores al actual
        const isActive = stepNumber === currentStep; // Paso actualmente seleccionado

        return (
          <React.Fragment key={index}>
            <div
              className={clsx(
                typeof stepClassName === "function"
                  ? stepClassName(index, isActive, isCompleted)
                  : stepClassName
              )}
            >
              <span
                className={clsx(
                  typeof iconClassName === "function"
                    ? iconClassName(index, isActive, isCompleted)
                    : iconClassName
                )}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.32923 13.2293L3.85423 9.75426L2.6709 10.9293L7.32923 15.5876L17.3292 5.5876L16.1542 4.4126L7.32923 13.2293Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </span>
              <span
                className={clsx(
                  typeof textClassName === "function"
                    ? textClassName(index, isActive, isCompleted)
                    : textClassName
                )}
              >
                {step.text}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className={separatorClassName}>-</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepTracker;
