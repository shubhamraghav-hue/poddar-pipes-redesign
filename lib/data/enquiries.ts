import { COMPANY } from "@/lib/data/offices";

// Role-based inboxes surfaced on the 404 page. HR is the client-approved
// careers contact; distributor enquiries go to the official inbox (no separate
// distributor address exists).
export const HR_EMAIL = COMPANY.hrEmail;
export const DISTRIBUTOR_EMAIL = COMPANY.email;
