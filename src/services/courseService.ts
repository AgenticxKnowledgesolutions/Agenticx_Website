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

// Client Caching State
let cachedCourses: Course[] = [];
let coursesLoaded = false;
let lastFetched: number | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL

export const invalidateCourseCache = () => {
  coursesLoaded = false;
  cachedCourses = [];
  lastFetched = null;
};

export const getCourses = async (forceRefresh = false): Promise<Course[]> => {
  const now = Date.now();
  const isExpired = lastFetched ? (now - lastFetched > CACHE_TTL) : true;

  if (coursesLoaded && !forceRefresh && !isExpired) {
    return cachedCourses;
  }

  try {
    const res = await api.get("/courses/");
    const mapped = Array.isArray(res.data) ? res.data.map(mapCourse) : [];
    cachedCourses = mapped;
    coursesLoaded = true;
    lastFetched = now;
    return cachedCourses;
  } catch (err) {
    console.error("Failed to fetch courses from API:", err);
    return cachedCourses; // Return stale cache if load fails
  }
};

export const getCourseBySlug = async (slug: string, forceRefresh = false): Promise<Course | null> => {
  if (coursesLoaded && !forceRefresh) {
    const cached = cachedCourses.find(c => c.slug === slug);
    if (cached) return cached;
  }

  try {
    const res = await api.get(`/courses/${slug}`);
    const mapped = res.data ? mapCourse(res.data) : null;
    if (mapped) {
      if (!coursesLoaded) {
        cachedCourses = [mapped];
        coursesLoaded = true;
        lastFetched = Date.now();
      } else {
        const index = cachedCourses.findIndex(c => c.slug === slug);
        if (index > -1) {
          cachedCourses[index] = mapped;
        } else {
          cachedCourses.push(mapped);
        }
      }
    }
    return mapped;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status: number } };
    if (axiosErr.response?.status === 404) return null;
    console.error("Failed to fetch course by slug:", err);
    return null;
  }
};

export const getCourseById = async (id: string, forceRefresh = false): Promise<Course | null> => {
  if (coursesLoaded && !forceRefresh) {
    const cached = cachedCourses.find(c => c.id === id);
    if (cached) return cached;
  }

  try {
    const res = await api.get(`/courses/`);
    if (Array.isArray(res.data)) {
      const match = res.data.find((c: any) => String(c.id) === id);
      if (match) {
        const mapped = mapCourse(match);
        if (coursesLoaded) {
          const index = cachedCourses.findIndex(c => c.id === id);
          if (index > -1) {
            cachedCourses[index] = mapped;
          } else {
            cachedCourses.push(mapped);
          }
        }
        return mapped;
      }
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
    invalidateCourseCache();
    return res.data ? mapCourse(res.data) : null;
  } catch (err) {
    console.error("Failed to create course:", err);
    return null;
  }
};

export const updateCourse = async (courseId: string, payload: any): Promise<Course | null> => {
  try {
    const res = await api.put(`/courses/${courseId}`, payload);
    invalidateCourseCache();
    return res.data ? mapCourse(res.data) : null;
  } catch (err) {
    console.error("Failed to update course:", err);
    return null;
  }
};

export const deleteCourse = async (courseId: string): Promise<boolean> => {
  try {
    await api.delete(`/courses/${courseId}`);
    invalidateCourseCache();
    return true;
  } catch (err) {
    console.error("Failed to delete course:", err);
    return false;
  }
};

export const saveCourses = async (courses: Course[]): Promise<void> => {
  localStorage.setItem("courses", JSON.stringify(courses));
};
