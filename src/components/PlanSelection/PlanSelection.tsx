"use client";

import React from "react";
import { Button } from "@mui/material";
import { LazyImageRenderer } from "lazy-image-renderer";

import styles from "./PlanSelection.module.scss";

import { Plan } from "@/interfaces/plan";

interface PlanSelectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  handlePlanSelection: (planId: string) => void;
}

const plans: Plan[] = [
  {
    id: "standard",
    icon: "icon/Standar_plan_icon.svg",
    title: "Standard Plan",
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

const PlanSelection: React.FC<PlanSelectionProps> = ({
  formData,
  handlePlanSelection,
}) => {
  return (
    <div className={styles.planOptions}>
      {plans.map((plan) => (
        <div key={plan.id} className={styles.planWrapper}>
          <Button
            variant="contained"
            onClick={() => handlePlanSelection(plan.id)}
            className={styles.planCard}
          >
            <div className={styles.planCardContent}>
              <LazyImageRenderer
                src={plan.icon}
                alt={plan.title}
                width={40}
                height={40}
                className={styles.planLogo}
              />
              <span className={styles.planTitle}>{plan.title}</span>
              <span className={styles.planPrice}>{plan.price}</span>
              <small className={styles.planAdditionalCosts}>
                {plan.additionalCosts}
              </small>
            </div>
          </Button>
          {formData.creditCards && formData.creditCards[plan.id] && (
            <div className={styles.cardInfoButton}>
              <span>Credit card</span>
              <Button
                variant="text"
                onClick={() => handlePlanSelection(plan.id)}
                className={styles.cardInfo}
              >
                <div>
                  <LazyImageRenderer
                    width={22.358}
                    height={13.4}
                    src={"icon/Mastercard.svg"}
                  />
                  <span>
                    •••• •••• •••• {formData.creditCards[plan.id]?.last4}
                  </span>
                </div>
                <LazyImageRenderer
                  width={15.41}
                  height={16.251}
                  src={"icon/Edit_icon.svg"}
                />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanSelection;
