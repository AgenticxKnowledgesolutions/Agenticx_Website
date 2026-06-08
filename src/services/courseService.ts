import { api } from "./apiService";

export interface TechStack {
  name: string;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
}

export interface CurriculumMonth {
  tabTitle: string;
  sectionTitle: string;
  modules: ModuleData[];
}

export interface Course {
  id: string;
  slug: string;
  badge: string;
  title: string;
  description: string;
  stats: {
    duration: string;
    format: string;
    projects: string;
    careerSupport: string;
  };
  stack: TechStack[];
  curriculum: CurriculumMonth[];
  nextCohort: string;
  isAiOptimized: boolean;
  price: number;
  coverImageUrl?: string;
  brochureUrl?: string;
}

export const mapCourse = (data: any): Course => {
  return {
    id: data?.id ? String(data.id) : "",
    slug: data?.slug ? String(data.slug) : "",
    badge: data?.badge ? String(data.badge) : "",
    title: data?.title ? String(data.title) : "",
    description: data?.description ? String(data.description) : "",
    stats: {
      duration: data?.stats?.duration || data?.duration || "N/A",
      format: data?.stats?.format || data?.format || "N/A",
      projects: data?.stats?.projects || data?.projects || "N/A",
      careerSupport: data?.stats?.careerSupport || data?.career_support || "N/A"
    },
    stack: Array.isArray(data?.stack)
      ? data.stack.map((item: any) => ({
          name: item?.name ? String(item.name) : ""
        }))
      : [],
    curriculum: Array.isArray(data?.curriculum)
      ? data.curriculum.map((month: any) => ({
          tabTitle: month?.tabTitle || month?.tab_title || "",
          sectionTitle: month?.sectionTitle || month?.section_title || "",
          modules: Array.isArray(month?.modules)
            ? month.modules.map((mod: any) => ({
                id: mod?.id ? String(mod.id) : "",
                title: mod?.title ? String(mod.title) : "",
                description: mod?.description ? String(mod.description) : ""
              }))
            : []
        }))
      : [],
    nextCohort: data?.nextCohort || data?.next_cohort || "",
    isAiOptimized: !!(data?.isAiOptimized || data?.is_ai_optimized),
    price: data?.price !== null && data?.price !== undefined ? Number(data.price) : 0,
    coverImageUrl: data?.coverImageUrl || data?.cover_image_url || undefined,
    brochureUrl: data?.brochureUrl || data?.brochure_url || undefined
  };
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const res = await api.get("/courses/");
    return Array.isArray(res.data) ? res.data.map(mapCourse) : [];
  } catch (err) {
    console.error("Failed to fetch courses from API:", err);
    return [];
  }
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
  try {
    const res = await api.get(`/courses/${slug}`);
    return res.data ? mapCourse(res.data) : null;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status: number } };
    if (axiosErr.response?.status === 404) return null;
    console.error("Failed to fetch course:", err);
    return null;
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  try {
    const res = await api.get(`/courses/`);
    if (Array.isArray(res.data)) {
      const match = res.data.find((c: any) => c.id === id);
      return match ? mapCourse(match) : null;
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch course by ID:", err);
    return null;
  }
};

export const createCourse = async (payload: any): Promise<Course | null> => {
  try {
    const res = await api.post("/courses/", payload);
    return res.data ? mapCourse(res.data) : null;
  } catch (err) {
    console.error("Failed to create course:", err);
    return null;
  }
};

export const updateCourse = async (courseId: string, payload: any): Promise<Course | null> => {
  try {
    const res = await api.put(`/courses/${courseId}`, payload);
    return res.data ? mapCourse(res.data) : null;
  } catch (err) {
    console.error("Failed to update course:", err);
    return null;
  }
};

export const deleteCourse = async (courseId: string): Promise<boolean> => {
  try {
    await api.delete(`/courses/${courseId}`);
    return true;
  } catch (err) {
    console.error("Failed to delete course:", err);
    return false;
  }
};

export const saveCourses = async (courses: Course[]): Promise<void> => {
  localStorage.setItem("courses", JSON.stringify(courses));
};
