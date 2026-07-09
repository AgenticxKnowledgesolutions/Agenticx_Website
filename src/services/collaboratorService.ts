import { api } from "./apiService";
import type { Collaborator } from "@/types/collaborator";

const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: "1",
    name: "Indian Institute of Technology (IIT)",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
    isActive: true,
  },
  {
    id: "2",
    name: "National Institute of Technology (NIT)",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/NIT_Calicut_logo.png",
    isActive: true,
  },
  {
    id: "3",
    name: "Google for Education",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    isActive: true,
  },
  {
    id: "4",
    name: "Microsoft Research",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    isActive: true,
  },
  {
    id: "5",
    name: "Amazon Web Services",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    isActive: true,
  },
  {
    id: "6",
    name: "IBM Academic Initiative",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    isActive: true,
  }
];

function mapCollaborator(r: Record<string, unknown>): Collaborator {
  return {
    id: String(r.id),
    name: (r.name as string) || "Collaborator",
    logo: (r.logo_url as string) || (r.logo as string) || "",
    isActive: (r.is_active ?? r.isActive ?? true) as boolean,
    displayOrder: (r.display_order ?? r.displayOrder ?? 0) as number,
  };
}

export const getCollaborators = async (): Promise<Collaborator[]> => {
  try {
    const res = await api.get("/collaborators/");
    if (Array.isArray(res.data)) {
      return res.data.map(mapCollaborator);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch collaborators from API:", err);
    if (import.meta.env.DEV) {
      console.log("Dev mode: falling back to mock collaborators for UI verification.");
      return MOCK_COLLABORATORS;
    }
    return [];
  }
};

export const getAdminCollaborators = async (): Promise<Collaborator[]> => {
  try {
    const res = await api.get("/admin/collaborators/");
    if (Array.isArray(res.data)) {
      return res.data.map(mapCollaborator);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch admin collaborators:", err);
    throw err;
  }
};

export const getCollaboratorById = async (id: string): Promise<Collaborator | null> => {
  try {
    const res = await api.get("/admin/collaborators/");
    if (Array.isArray(res.data)) {
      const match = res.data.find((c: { id: string }) => String(c.id) === id);
      if (match) return mapCollaborator(match as unknown as Record<string, unknown>);
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch collaborator by id ${id}:`, err);
    throw err;
  }
};

export const createCollaborator = async (data: {
  name: string;
  logo_url: string;
  display_order: number;
  is_active: boolean;
}): Promise<boolean> => {
  try {
    const res = await api.post("/admin/collaborators/", data);
    return !!res.data;
  } catch (err) {
    console.error("Failed to create collaborator:", err);
    return false;
  }
};

export const updateCollaborator = async (
  id: string,
  data: {
    name?: string;
    logo_url?: string;
    display_order?: number;
    is_active?: boolean;
  }
): Promise<boolean> => {
  try {
    const res = await api.put(`/admin/collaborators/${id}`, data);
    return !!res.data;
  } catch (err) {
    console.error(`Failed to update collaborator ${id}:`, err);
    return false;
  }
};

export const deleteCollaborator = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/admin/collaborators/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete collaborator ${id}:`, err);
    return false;
  }
};
