export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  selectedPlan: string | undefined;
  creditCards: Record<string, { last4: string } | null>;
}
