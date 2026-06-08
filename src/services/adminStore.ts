import { create } from "zustand";
import { getLeads } from "./leadService";
import type { Lead } from "./leadService";
import { getDashboardSummary } from "./dashboardService";
import type { DashboardSummary } from "./dashboardService";
import { getCourses } from "./courseService";
import type { Course } from "./courseService";
import { getActivities } from "./activityService";
import type { Activity } from "./activityService";
import { getReviews } from "./reviewsService";
import type { Review } from "@/types/review";

interface AdminState {
  leads: Lead[];
  summary: DashboardSummary | null;
  courses: Course[];
  activities: Activity[];
  reviews: Review[];

  leadsLoaded: boolean;
  summaryLoaded: boolean;
  coursesLoaded: boolean;
  activitiesLoaded: boolean;
  reviewsLoaded: boolean;

  loadingLeads: boolean;
  loadingSummary: boolean;
  loadingCourses: boolean;
  loadingActivities: boolean;
  loadingReviews: boolean;
  
  fetchLeads: (force?: boolean) => Promise<Lead[]>;
  fetchSummary: (force?: boolean) => Promise<DashboardSummary | null>;
  fetchCourses: (force?: boolean) => Promise<Course[]>;
  fetchActivities: (force?: boolean) => Promise<Activity[]>;
  fetchReviews: (force?: boolean) => Promise<Review[]>;

  invalidateLeads: () => void;
  invalidateSummary: () => void;
  invalidateCourses: () => void;
  invalidateActivities: () => void;
  invalidateReviews: () => void;
  invalidateAll: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  leads: [],
  summary: null,
  courses: [],
  activities: [],
  reviews: [],

  leadsLoaded: false,
  summaryLoaded: false,
  coursesLoaded: false,
  activitiesLoaded: false,
  reviewsLoaded: false,

  loadingLeads: false,
  loadingSummary: false,
  loadingCourses: false,
  loadingActivities: false,
  loadingReviews: false,

  fetchLeads: async (force = false) => {
    if (get().leadsLoaded && !force && !get().loadingLeads) {
      return get().leads;
    }
    set({ loadingLeads: true });
    try {
      const data = await getLeads();
      set({ leads: data, leadsLoaded: true, loadingLeads: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch leads:", err);
      set({ loadingLeads: false });
      return [];
    }
  },

  fetchSummary: async (force = false) => {
    if (get().summaryLoaded && !force && !get().loadingSummary) {
      return get().summary;
    }
    set({ loadingSummary: true });
    try {
      const data = await getDashboardSummary();
      set({ summary: data, summaryLoaded: true, loadingSummary: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch summary:", err);
      set({ loadingSummary: false });
      return null;
    }
  },

  fetchCourses: async (force = false) => {
    if (get().coursesLoaded && !force && !get().loadingCourses) {
      return get().courses;
    }
    set({ loadingCourses: true });
    try {
      const data = await getCourses();
      set({ courses: data, coursesLoaded: true, loadingCourses: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch courses:", err);
      set({ loadingCourses: false });
      return [];
    }
  },

  fetchActivities: async (force = false) => {
    if (get().activitiesLoaded && !force && !get().loadingActivities) {
      return get().activities;
    }
    set({ loadingActivities: true });
    try {
      const data = await getActivities();
      set({ activities: data, activitiesLoaded: true, loadingActivities: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch activities:", err);
      set({ loadingActivities: false });
      return [];
    }
  },

  fetchReviews: async (force = false) => {
    if (get().reviewsLoaded && !force && !get().loadingReviews) {
      return get().reviews;
    }
    set({ loadingReviews: true });
    try {
      const data = await getReviews();
      set({ reviews: data, reviewsLoaded: true, loadingReviews: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch reviews:", err);
      set({ loadingReviews: false });
      return [];
    }
  },

  invalidateLeads: () => {
    set({ leadsLoaded: false });
  },

  invalidateSummary: () => {
    set({ summaryLoaded: false });
  },

  invalidateCourses: () => {
    set({ coursesLoaded: false });
  },

  invalidateActivities: () => {
    set({ activitiesLoaded: false });
  },

  invalidateReviews: () => {
    set({ reviewsLoaded: false });
  },

  invalidateAll: () => {
    set({ 
      leadsLoaded: false, 
      summaryLoaded: false, 
      coursesLoaded: false, 
      activitiesLoaded: false, 
      reviewsLoaded: false 
    });
  }
}));
