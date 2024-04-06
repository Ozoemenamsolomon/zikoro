export interface TOrganization {
  id: number;
  created_at: string;
  organizationName: string;
  organizationSlug: string | null;
  subscriptionPlan: string;
  subscritionStartDate: string | null;
  subscriptionEndDate: string | null;
  organizationOwner: string;
  BillingAddress: string | null;
  TaxID: string | null;
  payoutAccountDetails: string | null;
  organizationOwnerId: number;
  organizationType: string;
  organizationLogo: string | null;
  country: string | null;
  eventPhoneNumber: string | null;
  eventWhatsApp: string | null;
  eventContactEmail: string | null;
  x: string | null;
  linkedIn: string | null;
  instagram: string | null;
  facebook: string | null;
  certificateAsset: TCertificateAsset | null;
  teamMembers: TOrganizationTeamMember[];
}

type TOrganizationTeamMember = {
  userId: string;
  userEmail: string;
  userRole: string;
};
export interface TCertificateAsset {
  elements: string[];
  backgrounds: string[];
}
