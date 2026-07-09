export interface PlacedStudent {
  id: string;
  name: string;
  photo: string; // mapped from photo_url
  companyName: string; // mapped from company_name
  role: string;
  isActive: boolean; // mapped from is_active
  displayOrder?: number; // mapped from display_order
}

