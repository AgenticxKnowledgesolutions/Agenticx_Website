import { api } from "./apiService";

export interface DashboardLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interestedCourse?: string;
  status: string;
  priority: string;
  assignedTo?: string;
  createdAt?: string;
  lastContactedAt?: string;
  nextFollowupDate?: string;
  followupNotes?: string;
  source?: string;
  adminNotes?: string;
}

export interface DashboardReview {
  id: string;
  name: string;
  rating: number;
  role?: string;
  source: string;
  createdAt?: string;
}

export interface LeadStatusCount {
  status: string;
  count: number;
}

export interface CourseInterestCount {
  course: string;
  count: number;
}

export interface MonthlyLeadCount {
  month: string;
  count: number;
}

export interface LeadFunnel {
  totalLeads: number;
  contacted: number;
  demoBooked: number;
  enrolled: number;
}

export interface CoursePerformance {
  courseName: string;
  leadCount: number;
  enrollmentCount: number;
  conversionRate: number;
}

export interface LeadSourceCount {
  source: string;
  count: number;
}

export interface RecentEnrollment {
  id: string;
  name: string;
  course: string;
  enrollmentDate: string;
}

export interface UpcomingActivity {
  id: string;
  title: string;
  date: string;
  seats: string;
  status: string;
}

export interface FollowupItem {
  id: string;
  name: string;
  course: string;
  phone: string;
  dueTime: string;
  priority: string;
}

export interface LeadsRequiringFollowup {
  pending: number;
  overdue: number;
  today: number;
}

export interface DashboardSummary {
  totalLeads: number;
  newLeads: number;
  totalCourses: number;
  totalReviews: number;
  totalActivities: number;
  conversionRate: number;
  leadsRequiringFollowup: LeadsRequiringFollowup;
  leadStatusBreakdown: LeadStatusCount[];
  courseInterest: CourseInterestCount[];
  monthlyLeads: MonthlyLeadCount[];
  recentLeads: DashboardLead[];
  recentReviews: DashboardReview[];
  
  // Phase 2 properties
  leadFunnel: LeadFunnel;
  coursePerformance: CoursePerformance[];
  leadSources: LeadSourceCount[];
  recentEnrollments: RecentEnrollment[];
  upcomingActivities: UpcomingActivity[];
  followups: FollowupItem[];
  alerts: string[];

  // Phase 3 CRM properties
  priorityBreakdown: Record<string, number>;
  potentialDuplicatesCount: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary | null> => {
  try {
    const res = await api.get("/dashboard/summary");
    const d = res.data;
    const t = d.totals || {};
    
    return {
      totalLeads: t.total_leads ?? 0,
      newLeads: t.new_leads_this_month ?? 0,
      totalCourses: t.total_courses ?? 0,
      totalReviews: t.total_reviews ?? 0,
      totalActivities: t.total_activities ?? 0,
      conversionRate: t.conversion_rate ?? 0,
      leadsRequiringFollowup: {
        pending: t.leads_requiring_followup?.pending ?? 0,
        overdue: t.leads_requiring_followup?.overdue ?? 0,
        today: t.leads_requiring_followup?.today ?? 0
      },
      leadStatusBreakdown: (d.lead_status_breakdown || []).map((b: any) => ({
        status: b.status || "Unknown",
        count: b.count ?? 0
      })),
      courseInterest: (d.course_interest || []).map((c: any) => ({
        course: c.course || "General Inquiry",
        count: c.count ?? 0
      })),
      monthlyLeads: (d.monthly_leads || []).map((m: any) => ({
        month: m.month || "Unknown",
        count: m.count ?? 0
      })),
      recentLeads: (d.recent_leads || []).map((l: any) => ({
        id: l.id,
        name: l.name || "",
        email: l.email || "",
        phone: l.phone || undefined,
        interestedCourse: l.interested_course || undefined,
        status: l.status || "Pending",
        priority: l.priority || "Cold",
        assignedTo: l.assigned_to || undefined,
        createdAt: l.created_at || undefined,
        lastContactedAt: l.last_contacted_at || undefined,
        nextFollowupDate: l.next_followup_date || undefined,
        followupNotes: l.followup_notes || undefined,
        source: l.source || undefined,
        adminNotes: l.admin_notes || undefined
      })),
      recentReviews: (d.recent_reviews || []).map((r: any) => ({
        id: r.id,
        name: r.name || "",
        rating: r.rating ?? 5,
        role: r.role || undefined,
        source: r.source || "internal",
        createdAt: r.created_at || undefined
      })),
      
      // Phase 2 properties
      leadFunnel: {
        totalLeads: d.lead_funnel?.total_leads ?? 0,
        contacted: d.lead_funnel?.contacted ?? 0,
        demoBooked: d.lead_funnel?.demo_booked ?? 0,
        enrolled: d.lead_funnel?.enrolled ?? 0
      },
      coursePerformance: (d.course_performance || []).map((cp: any) => ({
        courseName: cp.course_name || "Unknown",
        leadCount: cp.lead_count ?? 0,
        enrollmentCount: cp.enrollment_count ?? 0,
        conversionRate: cp.conversion_rate ?? 0
      })),
      leadSources: (d.lead_sources || []).map((ls: any) => ({
        source: ls.source || "Website",
        count: ls.count ?? 0
      })),
      recentEnrollments: (d.recent_enrollments || []).map((re: any) => ({
        id: re.id,
        name: re.name || "",
        course: re.course || "General Inquiry",
        enrollmentDate: re.enrollment_date || ""
      })),
      upcomingActivities: (d.upcoming_activities || []).map((ua: any) => ({
        id: ua.id,
        title: ua.title || "",
        date: ua.date || "",
        seats: ua.seats || "Open",
        status: ua.status || "Active"
      })),
      followups: (d.followups || []).map((f: any) => ({
        id: f.id,
        name: f.name || "",
        course: f.course || "General Inquiry",
        phone: f.phone || "",
        dueTime: f.dueTime || f.due_time || "",
        priority: f.priority || "Cold"
      })),
      alerts: d.alerts || [],

      // Phase 3 CRM properties
      priorityBreakdown: d.priority_breakdown || { Hot: 0, Warm: 0, Cold: 0 },
      potentialDuplicatesCount: t.potential_duplicates_count ?? 0
    };
  } catch (err) {
    console.error("Failed to fetch dashboard summary:", err);
    return null;
  }
};
