
import { LinkedInTrackerData, WeeklyTaskData, ReportTrackerData, ContactEntry } from '../types';

const STORAGE_KEYS = {
  LINKEDIN: 'ent_linkedin_v2',
  TASKS: 'ent_task_v2',
  REPORTS: 'ent_reports_v2',
  CONTACTS: 'ent_contacts_v2',
};

export const storageService = {
  getLinkedInData: (): LinkedInTrackerData => {
    const data = localStorage.getItem(STORAGE_KEYS.LINKEDIN);
    return data ? JSON.parse(data) : {};
  },
  saveLinkedInData: (data: LinkedInTrackerData) => {
    localStorage.setItem(STORAGE_KEYS.LINKEDIN, JSON.stringify(data));
  },

  getTaskData: (): WeeklyTaskData => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : {};
  },
  saveTaskData: (data: WeeklyTaskData) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data));
  },

  getReportData: (): ReportTrackerData => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : {};
  },
  saveReportData: (data: ReportTrackerData) => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data));
  },

  // Added methods for ContactEntry data
  getContactData: (): ContactEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  },
  saveContactData: (data: ContactEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(data));
  }
};
