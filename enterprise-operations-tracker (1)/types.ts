
export type Domain = 
  | "Enterprise Applications"
  | "Information Security"
  | "Application Platforms & Automation"
  | "Workplace Productivity & Collaboration";

export type SubDomainMap = {
  [key in Domain]: string[];
};

export type Role = 'Analyst' | 'Head';

export interface User {
  id: string;
  name: string;
  role: Role;
  domain: Domain | 'ALL';
  subDomain: string | 'ALL';
}

export interface LinkedInStatus {
  individual: string;
  subdomain: string;
}

export interface LinkedInTrackerData {
  [subDomain: string]: {
    [month: string]: {
      [analystName: string]: LinkedInStatus;
    };
  };
}

export interface ReportStatus {
  qir: string;
  qbr: string;
  mir: string;
}

export interface ReportTrackerData {
  [subDomain: string]: {
    [year: string]: {
      [month: string]: {
        [analystName: string]: ReportStatus;
      };
    };
  };
}

export interface WeeklyTaskData {
  [userId: string]: {
    [month: string]: {
      [week: string]: {
        dailyCadence: string;
        shortCalls: string;
        briefings: string;
        adHoc: string;
      };
    };
  };
}

// Added ContactEntry interface for ContactTracker
export interface ContactEntry {
  id: string;
  subDomain: string;
  owner: string;
  customerName: string;
  leadARCo: string;
  emailId: string;
  leadSource: string;
  pastSale: string;
  pastSaleValue: string;
  reachOutStatus: string;
  initialCall: string;
  initialCallDate: string;
  rfiSent: string;
  rfiSentFollowUp: string;
}
