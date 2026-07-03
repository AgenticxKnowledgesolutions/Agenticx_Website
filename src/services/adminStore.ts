import { create } from "zustand";
import { getLeads, getTrashLeads } from "./leadService";
import type { Lead } from "./leadService";
import { getDashboardSummary } from "./dashboardService";
import type { DashboardSummary } from "./dashboardService";
import { getCourses, getTrashCourses, invalidateCourseCache } from "./courseService";
import type { Course } from "./courseService";
import { getActivities, getTrashActivities } from "./activityService";
import type { Activity } from "./activityService";
import { getReviews, getTrashReviews } from "./reviewsService";
import type { Review } from "@/types/review";

interface AdminState {
  leads: Lead[];
  summary: DashboardSummary | null;
  courses: Course[];
  activities: Activity[];
  reviews: Review[];

  trashLeads: Lead[];
  trashCourses: Course[];
  trashActivities: Activity[];
  trashReviews: Review[];

  leadsLoaded: boolean;
  summaryLoaded: boolean;
  coursesLoaded: boolean;
  activitiesLoaded: boolean;
  reviewsLoaded: boolean;

  trashLeadsLoaded: boolean;
  trashCoursesLoaded: boolean;
  trashActivitiesLoaded: boolean;
  trashReviewsLoaded: boolean;

  loadingLeads: boolean;
  loadingSummary: boolean;
  loadingCourses: boolean;
  loadingActivities: boolean;
  loadingReviews: boolean;

  loadingTrashLeads: boolean;
  loadingTrashCourses: boolean;
  loadingTrashActivities: boolean;
  loadingTrashReviews: boolean;
  
  leadsSkip: number;
  leadsHasMore: boolean;
  loadingMoreLeads: boolean;

  fetchLeads: (force?: boolean) => Promise<Lead[]>;
  fetchMoreLeads: () => Promise<Lead[]>;
  fetchSummary: (force?: boolean) => Promise<DashboardSummary | null>;
  fetchCourses: (force?: boolean) => Promise<Course[]>;
  fetchActivities: (force?: boolean) => Promise<Activity[]>;
  fetchReviews: (force?: boolean) => Promise<Review[]>;

  fetchTrashLeads: (force?: boolean) => Promise<Lead[]>;
  fetchTrashCourses: (force?: boolean) => Promise<Course[]>;
  fetchTrashActivities: (force?: boolean) => Promise<Activity[]>;
  fetchTrashReviews: (force?: boolean) => Promise<Review[]>;

  invalidateLeads: () => void;
  invalidateSummary: () => void;
  invalidateCourses: () => void;
  invalidateActivities: () => void;
  invalidateReviews: () => void;

  invalidateTrashLeads: () => void;
  invalidateTrashCourses: () => void;
  invalidateTrashActivities: () => void;
  invalidateTrashReviews: () => void;

  invalidateAll: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  leads: [],
  summary: null,
  courses: [],
  activities: [],
  reviews: [],

  trashLeads: [],
  trashCourses: [],
  trashActivities: [],
  trashReviews: [],

  leadsLoaded: false,
  summaryLoaded: false,
  coursesLoaded: false,
  activitiesLoaded: false,
  reviewsLoaded: false,

  trashLeadsLoaded: false,
  trashCoursesLoaded: false,
  trashActivitiesLoaded: false,
  trashReviewsLoaded: false,

  leadsSkip: 0,
  leadsHasMore: true,
  loadingMoreLeads: false,
  loadingLeads: false,
  loadingSummary: false,
  loadingCourses: false,
  loadingActivities: false,
  loadingReviews: false,

  loadingTrashLeads: false,
  loadingTrashCourses: false,
  loadingTrashActivities: false,
  loadingTrashReviews: false,

  fetchLeads: async (force = false) => {
    if (get().leadsLoaded && !force && !get().loadingLeads) {
      return get().leads;
    }
    set({ loadingLeads: true, leadsSkip: 0, leadsHasMore: true });
    try {
      const data = await getLeads(0, 50);
      set({ 
        leads: data, 
        leadsLoaded: true, 
        loadingLeads: false,
        leadsSkip: data.length,
        leadsHasMore: data.length === 50
      });
      return data;
    } catch (err) {
      console.error("Store failed to fetch leads:", err);
      set({ loadingLeads: false });
      return [];
    }
  },

  fetchMoreLeads: async () => {
    const { loadingLeads, loadingMoreLeads, leadsHasMore, leadsSkip, leads } = get();
    if (loadingLeads || loadingMoreLeads || !leadsHasMore) {
      return leads;
    }
    set({ loadingMoreLeads: true });
    try {
      const data = await getLeads(leadsSkip, 50);
      const newLeads = [...leads, ...data];
      set({
        leads: newLeads,
        loadingMoreLeads: false,
        leadsSkip: leadsSkip + data.length,
        leadsHasMore: data.length === 50
      });
      return newLeads;
    } catch (err) {
      console.error("Store failed to fetch more leads:", err);
      set({ loadingMoreLeads: false });
      return leads;
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
      const data = await getCourses(force);
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

  fetchTrashLeads: async (force = false) => {
    if (get().trashLeadsLoaded && !force && !get().loadingTrashLeads) {
      return get().trashLeads;
    }
    set({ loadingTrashLeads: true });
    try {
      const data = await getTrashLeads();
      set({ trashLeads: data, trashLeadsLoaded: true, loadingTrashLeads: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch trash leads:", err);
      set({ loadingTrashLeads: false });
      return [];
    }
  },

  fetchTrashCourses: async (force = false) => {
    if (get().trashCoursesLoaded && !force && !get().loadingTrashCourses) {
      return get().trashCourses;
    }
    set({ loadingTrashCourses: true });
    try {
      const data = await getTrashCourses();
      set({ trashCourses: data, trashCoursesLoaded: true, loadingTrashCourses: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch trash courses:", err);
      set({ loadingTrashCourses: false });
      return [];
    }
  },

  fetchTrashActivities: async (force = false) => {
    if (get().trashActivitiesLoaded && !force && !get().loadingTrashActivities) {
      return get().trashActivities;
    }
    set({ loadingTrashActivities: true });
    try {
      const data = await getTrashActivities();
      set({ trashActivities: data, trashActivitiesLoaded: true, loadingTrashActivities: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch trash activities:", err);
      set({ loadingTrashActivities: false });
      return [];
    }
  },

  fetchTrashReviews: async (force = false) => {
    if (get().trashReviewsLoaded && !force && !get().loadingTrashReviews) {
      return get().trashReviews;
    }
    set({ loadingTrashReviews: true });
    try {
      const data = await getTrashReviews();
      set({ trashReviews: data, trashReviewsLoaded: true, loadingTrashReviews: false });
      return data;
    } catch (err) {
      console.error("Store failed to fetch trash reviews:", err);
      set({ loadingTrashReviews: false });
      return [];
    }
  },

  invalidateLeads: () => {
    set({ leadsLoaded: false, leadsSkip: 0, leadsHasMore: true });
  },

  invalidateSummary: () => {
    set({ summaryLoaded: false });
  },

  invalidateCourses: () => {
    set({ coursesLoaded: false });
    invalidateCourseCache();
  },

  invalidateActivities: () => {
    set({ activitiesLoaded: false });
  },

  invalidateReviews: () => {
    set({ reviewsLoaded: false });
  },

  invalidateTrashLeads: () => {
    set({ trashLeadsLoaded: false });
  },

  invalidateTrashCourses: () => {
    set({ trashCoursesLoaded: false });
  },

  invalidateTrashActivities: () => {
    set({ trashActivitiesLoaded: false });
  },

  invalidateTrashReviews: () => {
    set({ trashReviewsLoaded: false });
  },

  invalidateAll: () => {
    set({ 
      leadsLoaded: false, 
      summaryLoaded: false, 
      coursesLoaded: false, 
      activitiesLoaded: false, 
      reviewsLoaded: false,
      trashLeadsLoaded: false,
      trashCoursesLoaded: false,
      trashActivitiesLoaded: false,
      trashReviewsLoaded: false,
      leadsSkip: 0,
      leadsHasMore: true
    });
    invalidateCourseCache();
  }
}));
