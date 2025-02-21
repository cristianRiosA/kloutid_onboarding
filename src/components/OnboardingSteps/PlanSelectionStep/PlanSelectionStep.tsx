import PlanSelection from "@/components/PlanSelection/PlanSelection";

import styles from "./PlanSelectionStep.module.scss";

interface PlanSelectionStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  handlePlanSelection: (planId: string) => void;
}

const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  formData,
  handlePlanSelection,
}) => {
  return (
    <>
      <span className={styles.informativeText}>
        Select the plan, connect your payment method, and activate your account
        to offer discounts.
      </span>
      <div>
        <PlanSelection
          formData={formData}
          handlePlanSelection={handlePlanSelection}
        />
      </div>
    </>
  );
};

export default PlanSelectionStep;
