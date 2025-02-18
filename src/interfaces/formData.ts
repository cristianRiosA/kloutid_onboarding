export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  selectedPlan: string | undefined;
  creditCards: Record<string, { last4: string } | null>;
}
