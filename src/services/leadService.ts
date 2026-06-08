import { api } from "./apiService";

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy?: string;
  createdAt: string;
}

export interface LeadTimelineEvent {
  id: string;
  leadId: string;
  eventType: string;
  description: string;
  createdBy?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  interestedCourse?: string;
  sourcePage?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  lastContactedAt?: string;
  nextFollowupDate?: string;
  followupNotes?: string;
  source?: string;
  priority: string;
  assignedTo?: string;
  notes?: LeadNote[];
  timelineEvents?: LeadTimelineEvent[];
}

// Map FastAPI snake_case response to frontend camelCase interfaces
function mapNote(n: any): LeadNote {
  return {
    id: n.id,
    leadId: n.lead_id,
    content: n.content,
    createdBy: n.created_by || undefined,
    createdAt: n.created_at,
  };
}

function mapTimelineEvent(t: any): LeadTimelineEvent {
  return {
    id: t.id,
    leadId: t.lead_id,
    eventType: t.event_type,
    description: t.description,
    createdBy: t.created_by || undefined,
    createdAt: t.created_at,
  };
}

function mapLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    phone: (r.phone as string | undefined) ?? undefined,
    message: (r.message as string | undefined) ?? undefined,
    interestedCourse: (r.interested_course as string | undefined) ?? undefined,
    sourcePage: (r.source_page as string | undefined) ?? undefined,
    status: (r.status as string) ?? "Pending",
    adminNotes: (r.admin_notes as string | undefined) ?? undefined,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
    lastContactedAt: (r.last_contacted_at as string | undefined) ?? undefined,
    nextFollowupDate: (r.next_followup_date as string | undefined) ?? undefined,
    followupNotes: (r.followup_notes as string | undefined) ?? undefined,
    source: (r.source as string | undefined) ?? undefined,
    priority: (r.priority as string) ?? "Cold",
    assignedTo: (r.assigned_to as string | undefined) ?? undefined,
    notes: Array.isArray(r.notes) ? r.notes.map(mapNote) : [],
    timelineEvents: Array.isArray(r.timeline_events) ? r.timeline_events.map(mapTimelineEvent) : [],
  };
}

export const getLeads = async (): Promise<Lead[]> => {
  try {
    const res = await api.get("/leads/");
    return (res.data as Record<string, unknown>[]).map(mapLead);
  } catch (err) {
    console.error("Failed to fetch leads:", err);
    return [];
  }
};

export const getLeadById = async (leadId: string): Promise<Lead | null> => {
  try {
    const res = await api.get(`/leads/${leadId}`);
    return mapLead(res.data as Record<string, unknown>);
  } catch (err) {
    console.error(`Failed to fetch lead ${leadId}:`, err);
    return null;
  }
};

export const createLead = async (lead: Partial<Lead>): Promise<Lead | null> => {
  try {
    const payload = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      message: lead.message || null,
      interested_course: lead.interestedCourse || null,
      source_page: lead.sourcePage || null,
      source: lead.source || "Manual Entry",
      status: lead.status || "Pending",
      admin_notes: lead.adminNotes || null,
      priority: lead.priority || "Cold",
      assigned_to: lead.assignedTo || null,
    };
    const res = await api.post("/leads/", payload);
    return mapLead(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to create lead:", err);
    return null;
  }
};

export const updateLead = async (
  leadId: string, 
  status: string, 
  adminNotes?: string | null,
  lastContactedAt?: string | null,
  nextFollowupDate?: string | null,
  followupNotes?: string | null,
  source?: string | null,
  priority?: string | null,
  assignedTo?: string | null
): Promise<Lead | null> => {
  try {
    const payload = {
      status,
      admin_notes: adminNotes || null,
      last_contacted_at: lastContactedAt || null,
      next_followup_date: nextFollowupDate || null,
      followup_notes: followupNotes || null,
      source: source || null,
      priority: priority || null,
      assigned_to: assignedTo || null,
    };
    const res = await api.put(`/leads/${leadId}`, payload);
    return mapLead(res.data as Record<string, unknown>);
  } catch (err) {
    console.error("Failed to update lead:", err);
    return null;
  }
};

export const checkDuplicate = async (
  phone: string | null,
  email: string,
  course: string | null
): Promise<Lead | null> => {
  try {
    const res = await api.post("/leads/check-duplicate", {
      phone: phone || null,
      email,
      interested_course: course || null,
    });
    return res.data ? mapLead(res.data) : null;
  } catch (err) {
    console.error("Failed duplicate check:", err);
    return null;
  }
};

export const deleteLead = async (leadId: string): Promise<boolean> => {
  try {
    await api.delete(`/leads/${leadId}`);
    return true;
  } catch (err) {
    console.error(`Failed to delete lead ${leadId}:`, err);
    return false;
  }
};

export const bulkUpdate = async (
  ids: string[],
  updates: Record<string, any>
): Promise<boolean> => {
  try {
    // Map camelCase keys to snake_case if present
    const mappedUpdates: Record<string, any> = {};
    if (updates.status !== undefined) mappedUpdates.status = updates.status;
    if (updates.priority !== undefined) mappedUpdates.priority = updates.priority;
    if (updates.source !== undefined) mappedUpdates.source = updates.source;
    if (updates.assignedTo !== undefined) mappedUpdates.assigned_to = updates.assignedTo;

    await api.post("/leads/bulk-update", {
      ids,
      updates: mappedUpdates,
    });
    return true;
  } catch (err) {
    console.error("Failed bulk update:", err);
    return false;
  }
};

export const bulkDelete = async (ids: string[]): Promise<boolean> => {
  try {
    await api.post("/leads/bulk-delete", { ids });
    return true;
  } catch (err) {
    console.error("Failed bulk delete:", err);
    return false;
  }
};

export const addNote = async (leadId: string, content: string): Promise<LeadNote | null> => {
  try {
    const res = await api.post(`/leads/${leadId}/notes`, { content });
    return mapNote(res.data);
  } catch (err) {
    console.error(`Failed to add note to lead ${leadId}:`, err);
    return null;
  }
};

export const getTimeline = async (leadId: string): Promise<LeadTimelineEvent[]> => {
  try {
    const res = await api.get(`/leads/${leadId}/timeline`);
    return (res.data as any[]).map(mapTimelineEvent);
  } catch (err) {
    console.error(`Failed to get timeline for lead ${leadId}:`, err);
    return [];
  }
};
