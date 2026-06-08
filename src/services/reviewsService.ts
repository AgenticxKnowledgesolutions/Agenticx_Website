import { api } from "./apiService";
import type { Review } from "@/types/review";

// Map FastAPI response fields to frontend Review interface
function mapReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    name: r.name as string,
    rating: r.rating as number,
    review: r.review as string,
    role: r.role as string | undefined,
    image: (r.image_url as string | undefined) ?? undefined,
    source: r.source as "google" | "internal",
  };
}

export const getReviews = async (): Promise<Review[]> => {
  try {
    const res = await api.get("/reviews/");
    return (res.data as Record<string, unknown>[]).map(mapReview);
  } catch (err) {
    console.error("Failed to fetch reviews from API:", err);
    return [];
  }
};

export const getReviewById = async (id: string): Promise<Review | null> => {
  try {
    const res = await api.get("/reviews/");
    const all = (res.data as Record<string, unknown>[]).map(mapReview);
    return all.find(rev => rev.id === id) || null;
  } catch (err) {
    console.error("Failed to fetch review by ID:", err);
    return null;
  }
};

export const createReview = async (payload: any): Promise<Review | null> => {
  try {
    const res = await api.post("/reviews/", payload);
    return mapReview(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to create review:", err);
    return null;
  }
};

export const updateReview = async (id: string, payload: any): Promise<Review | null> => {
  try {
    const res = await api.put(`/reviews/${id}`, payload);
    return mapReview(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to update review:", err);
    return null;
  }
};

export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/reviews/${id}`);
    return true;
  } catch (err) {
    console.error("Failed to delete review:", err);
    return false;
  }
};

export const saveReviews = async (reviews: Review[]): Promise<void> => {
  localStorage.setItem("reviews", JSON.stringify(reviews));
};
