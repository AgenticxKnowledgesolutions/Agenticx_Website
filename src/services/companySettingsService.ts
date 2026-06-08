import { api } from "./apiService";

export interface CompanySettings {
  id: number;
  companyName: string;
  companyTagline?: string;
  companyDescription?: string;

  primaryPhone?: string;
  secondaryPhone?: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  websiteUrl?: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  googleMapsUrl?: string;

  placementAssistancePercentage: number;
  collegePartnersCount: number;
  graduatesTrainedCount: number;
  studentsTrainedCount: number;
  coreServicesCount: number;

  linkedinUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  whatsappNumber?: string;

  heroTitle?: string;
  heroDescription?: string;
  heroPrimaryCtaText?: string;
  heroSecondaryCtaText?: string;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  createdAt: string;
  updatedAt: string;
}

export function mapCompanySettings(r: Record<string, unknown>): CompanySettings {
  return {
    id: r.id as number,
    companyName: (r.company_name as string) || "",
    companyTagline: (r.company_tagline as string | undefined) ?? undefined,
    companyDescription: (r.company_description as string | undefined) ?? undefined,

    primaryPhone: (r.primary_phone as string | undefined) ?? undefined,
    secondaryPhone: (r.secondary_phone as string | undefined) ?? undefined,
    primaryEmail: (r.primary_email as string | undefined) ?? undefined,
    secondaryEmail: (r.secondary_email as string | undefined) ?? undefined,
    websiteUrl: (r.website_url as string | undefined) ?? undefined,

    addressLine1: (r.address_line_1 as string | undefined) ?? undefined,
    addressLine2: (r.address_line_2 as string | undefined) ?? undefined,
    city: (r.city as string | undefined) ?? undefined,
    state: (r.state as string | undefined) ?? undefined,
    country: (r.country as string | undefined) ?? undefined,
    postalCode: (r.postal_code as string | undefined) ?? undefined,
    googleMapsUrl: (r.google_maps_url as string | undefined) ?? undefined,

    placementAssistancePercentage: (r.placement_assistance_percentage as number) ?? 100,
    collegePartnersCount: (r.college_partners_count as number) ?? 0,
    graduatesTrainedCount: (r.graduates_trained_count as number) ?? 0,
    studentsTrainedCount: (r.students_trained_count as number) ?? 0,
    coreServicesCount: (r.core_services_count as number) ?? 0,

    linkedinUrl: (r.linkedin_url as string | undefined) ?? undefined,
    instagramUrl: (r.instagram_url as string | undefined) ?? undefined,
    facebookUrl: (r.facebook_url as string | undefined) ?? undefined,
    youtubeUrl: (r.youtube_url as string | undefined) ?? undefined,
    whatsappNumber: (r.whatsapp_number as string | undefined) ?? undefined,

    heroTitle: (r.hero_title as string | undefined) ?? undefined,
    heroDescription: (r.hero_description as string | undefined) ?? undefined,
    heroPrimaryCtaText: (r.hero_primary_cta_text as string | undefined) ?? undefined,
    heroSecondaryCtaText: (r.hero_secondary_cta_text as string | undefined) ?? undefined,

    metaTitle: (r.meta_title as string | undefined) ?? undefined,
    metaDescription: (r.meta_description as string | undefined) ?? undefined,
    metaKeywords: (r.meta_keywords as string | undefined) ?? undefined,

    createdAt: (r.created_at as string) ?? new Date().toISOString(),
    updatedAt: (r.updated_at as string) ?? new Date().toISOString(),
  };
}

export function mapCompanySettingsToBackend(s: Partial<CompanySettings>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (s.companyName !== undefined) payload.company_name = s.companyName;
  if (s.companyTagline !== undefined) payload.company_tagline = s.companyTagline || null;
  if (s.companyDescription !== undefined) payload.company_description = s.companyDescription || null;

  if (s.primaryPhone !== undefined) payload.primary_phone = s.primaryPhone || null;
  if (s.secondaryPhone !== undefined) payload.secondary_phone = s.secondaryPhone || null;
  if (s.primaryEmail !== undefined) payload.primary_email = s.primaryEmail || null;
  if (s.secondaryEmail !== undefined) payload.secondary_email = s.secondaryEmail || null;
  if (s.websiteUrl !== undefined) payload.website_url = s.websiteUrl || null;

  if (s.addressLine1 !== undefined) payload.address_line_1 = s.addressLine1 || null;
  if (s.addressLine2 !== undefined) payload.address_line_2 = s.addressLine2 || null;
  if (s.city !== undefined) payload.city = s.city || null;
  if (s.state !== undefined) payload.state = s.state || null;
  if (s.country !== undefined) payload.country = s.country || null;
  if (s.postalCode !== undefined) payload.postal_code = s.postalCode || null;
  if (s.googleMapsUrl !== undefined) payload.google_maps_url = s.googleMapsUrl || null;

  if (s.placementAssistancePercentage !== undefined) {
    const val = s.placementAssistancePercentage as any;
    payload.placement_assistance_percentage = val === "" ? 0 : Number(val);
  }
  if (s.collegePartnersCount !== undefined) {
    const val = s.collegePartnersCount as any;
    payload.college_partners_count = val === "" ? 0 : Number(val);
  }
  if (s.graduatesTrainedCount !== undefined) {
    const val = s.graduatesTrainedCount as any;
    payload.graduates_trained_count = val === "" ? 0 : Number(val);
  }
  if (s.studentsTrainedCount !== undefined) {
    const val = s.studentsTrainedCount as any;
    payload.students_trained_count = val === "" ? 0 : Number(val);
  }
  if (s.coreServicesCount !== undefined) {
    const val = s.coreServicesCount as any;
    payload.core_services_count = val === "" ? 0 : Number(val);
  }

  if (s.linkedinUrl !== undefined) payload.linkedin_url = s.linkedinUrl || null;
  if (s.instagramUrl !== undefined) payload.instagram_url = s.instagramUrl || null;
  if (s.facebookUrl !== undefined) payload.facebook_url = s.facebookUrl || null;
  if (s.youtubeUrl !== undefined) payload.youtube_url = s.youtubeUrl || null;
  if (s.whatsappNumber !== undefined) payload.whatsapp_number = s.whatsappNumber || null;

  if (s.heroTitle !== undefined) payload.hero_title = s.heroTitle || null;
  if (s.heroDescription !== undefined) payload.hero_description = s.heroDescription || null;
  if (s.heroPrimaryCtaText !== undefined) payload.hero_primary_cta_text = s.heroPrimaryCtaText || null;
  if (s.heroSecondaryCtaText !== undefined) payload.hero_secondary_cta_text = s.heroSecondaryCtaText || null;

  if (s.metaTitle !== undefined) payload.meta_title = s.metaTitle || null;
  if (s.metaDescription !== undefined) payload.meta_description = s.metaDescription || null;
  if (s.metaKeywords !== undefined) payload.meta_keywords = s.metaKeywords || null;

  return payload;
}

export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const res = await api.get("/company-settings");
    return mapCompanySettings(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to fetch company settings:", err);
    return null;
  }
};

export const updateCompanySettings = async (data: Partial<CompanySettings>): Promise<CompanySettings | null> => {
  try {
    const payload = mapCompanySettingsToBackend(data);
    const res = await api.put("/company-settings", payload);
    return mapCompanySettings(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to update company settings:", err);
    return null;
  }
};
