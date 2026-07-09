export interface Collaborator {
  id: string;
  name: string;
  logo: string; // mapped from logo_url
  isActive: boolean; // mapped from is_active
  displayOrder?: number;
}
