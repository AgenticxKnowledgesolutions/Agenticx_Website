import { api } from "./apiService";

export interface Activity {
  id: string;
  title: string;
  description?: string;
  image: string;       // frontend field name (mapped from image_url)
  duration: string;
  price?: number;
  isFree: boolean;     // frontend field name (mapped from is_free)
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

// Map FastAPI snake_case → frontend camelCase
function mapActivity(r: Record<string, unknown>): Activity {
  return {
    id: r.id as string,
    title: r.title as string,
    description: r.description as string | undefined,
    image: (r.image_url as string | undefined) ?? "",
    duration: r.duration as string,
    price: r.price !== null ? Number(r.price) : undefined,
    isFree: r.is_free as boolean,
    isDeleted: r.is_deleted as boolean | undefined,
    deletedAt: r.deleted_at as string | undefined,
    deletedBy: r.deleted_by as string | undefined,
  };
}

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const res = await api.get("/activities/");
    return (res.data as Record<string, unknown>[]).map(mapActivity);
  } catch (err) {
    console.error("Failed to fetch activities from API:", err);
    return [];
  }
};

export const getActivityById = async (id: string): Promise<Activity | null> => {
  try {
    const res = await api.get("/activities/");
    const all = (res.data as Record<string, unknown>[]).map(mapActivity);
    return all.find(act => act.id === id) || null;
  } catch (err) {
    console.error("Failed to get activity by ID:", err);
    return null;
  }
};

export const createActivity = async (payload: any): Promise<Activity | null> => {
  try {
    const res = await api.post("/activities/", payload);
    return mapActivity(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to create activity:", err);
    return null;
  }
};

export const updateActivity = async (id: string, payload: any): Promise<Activity | null> => {
  try {
    const res = await api.put(`/activities/${id}`, payload);
    return mapActivity(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to update activity:", err);
    return null;
  }
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/activities/${id}`);
    return true;
  } catch (err) {
    console.error("Failed to delete activity:", err);
    return false;
  }
};

export const getTrashActivities = async (): Promise<Activity[]> => {
  try {
    const res = await api.get("/activities/trash");
    return Array.isArray(res.data) ? res.data.map(mapActivity) : [];
  } catch (err) {
    console.error("Failed to fetch trash activities:", err);
    return [];
  }
};

export const restoreActivity = async (id: string): Promise<Activity | null> => {
  try {
    const res = await api.post(`/activities/${id}/restore`);
    return res.data ? mapActivity(res.data as Record<string, unknown>) : null;
  } catch (err) {
    console.error("Failed to restore activity:", err);
    return null;
  }
};

export const hardDeleteActivity = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/activities/${id}/hard-delete`);
    return true;
  } catch (err) {
    console.error("Failed to hard delete activity:", err);
    return false;
  }
};

export const saveActivities = async (activities: Activity[]): Promise<void> => {
  localStorage.setItem("activities", JSON.stringify(activities));
};
