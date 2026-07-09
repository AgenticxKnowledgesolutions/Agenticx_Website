import { api } from "./apiService";
import type { PlacedStudent } from "@/types/placedStudent";

const MOCK_PLACED_STUDENTS: PlacedStudent[] = [
  {
    id: "1",
    name: "Arjun Kumar",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&h=256&q=80",
    companyName: "KeyValue Software Systems",
    role: "AI Engineer",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "2",
    name: "Anjali Nair",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    companyName: "TCS",
    role: "Data Scientist",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "3",
    name: "Rahul Sharma",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    companyName: "UST Global",
    role: "Machine Learning Associate",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "4",
    name: "Sneha Joseph",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    companyName: "Infosys",
    role: "Full Stack Developer",
    isActive: true,
    displayOrder: 4,
  }
];

function mapPlacedStudent(r: Record<string, unknown>): PlacedStudent {
  return {
    id: String(r.id),
    name: (r.student_name as string) || (r.name as string) || "Student Name",
    photo: (r.photo_url as string) || (r.photo as string) || "",
    companyName: (r.company_name as string) || (r.companyName as string) || "",
    role: (r.job_role as string) || (r.role as string) || "",
    isActive: (r.is_active ?? r.isActive ?? true) as boolean,
    displayOrder: (r.display_order ?? r.displayOrder ?? 0) as number,
  };
}

export const getPlacedStudents = async (): Promise<PlacedStudent[]> => {
  try {
    const res = await api.get("/placed-students/");
    if (Array.isArray(res.data)) {
      return res.data.map(mapPlacedStudent);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch placed students from API:", err);
    if (import.meta.env.DEV) {
      console.log("Dev mode: falling back to mock placed students for UI verification.");
      return MOCK_PLACED_STUDENTS.filter((s) => s.isActive);
    }
    return [];
  }
};

export const getAdminPlacedStudents = async (): Promise<PlacedStudent[]> => {
  try {
    const res = await api.get("/admin/placed-students/");
    if (Array.isArray(res.data)) {
      return res.data.map(mapPlacedStudent);
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch admin placed students:", err);
    throw err;
  }
};

export const getPlacedStudentById = async (id: string): Promise<PlacedStudent | null> => {
  try {
    const res = await api.get("/admin/placed-students/");
    if (Array.isArray(res.data)) {
      const match = res.data.find((s: { id: string }) => String(s.id) === id);
      if (match) return mapPlacedStudent(match as unknown as Record<string, unknown>);
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch placed student by id ${id}:`, err);
    throw err;
  }
};

export const createPlacedStudent = async (data: {
  name: string;
  photo: string;
  companyName: string;
  role: string;
  displayOrder: number;
  isActive: boolean;
}): Promise<boolean> => {
  try {
    const payload = {
      student_name: data.name,
      photo_url: data.photo,
      company_name: data.companyName,
      job_role: data.role,
      display_order: data.displayOrder,
      is_active: data.isActive,
    };
    const res = await api.post("/admin/placed-students/", payload);
    return !!res.data;
  } catch (err) {
    console.error("Failed to create placed student:", err);
    return false;
  }
};

export const updatePlacedStudent = async (
  id: string,
  data: {
    name?: string;
    photo?: string;
    companyName?: string;
    role?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
): Promise<boolean> => {
  try {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.student_name = data.name;
    if (data.photo !== undefined) payload.photo_url = data.photo;
    if (data.companyName !== undefined) payload.company_name = data.companyName;
    if (data.role !== undefined) payload.job_role = data.role;
    if (data.displayOrder !== undefined) payload.display_order = data.displayOrder;
    if (data.isActive !== undefined) payload.is_active = data.isActive;

    const res = await api.put(`/admin/placed-students/${id}`, payload);
    return !!res.data;
  } catch (err) {
    console.error(`Failed to update placed student ${id}:`, err);
    return false;
  }
};

export const deletePlacedStudent = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/admin/placed-students/${id}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete placed student ${id}:`, err);
    return false;
  }
};
