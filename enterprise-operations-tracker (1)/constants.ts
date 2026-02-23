import { Domain, SubDomainMap } from './types';

export const DOMAIN_HIERARCHY: SubDomainMap = {
  "Enterprise Applications": [
    "ERP",
    "Supply Chain",
    "Financial Management Systems",
    "Sustainability",
    "HRTech",
    "Procurement",
    "Revenue & Monetization Platforms"
  ],
  "Information Security": [
    "Security and Risk Management",
    "IT Infrastructure & Cloud"
  ],
  "Application Platforms & Automation": [
    "Process Automation",
    "Process Excellence",
    "Enterprise Planning & Portfolio",
    "App Development & Deployment"
  ],
  "Workplace Productivity & Collaboration": [
    "Unified Communications",
    "Collaboration & Workplace",
    "Data Management",
    "Analytics & AI"
  ]
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export const STATUS_OPTIONS = [
  '',
  'Completed',
  'In Review',
  'Scheduled',
  'In Progress',
  'Missed'
];

export const REPORT_STATUS_OPTIONS = [
  '',
  'Not yet started',
  'In Progress',
  'In review',
  'Finalised',
  'Sent'
];

export const REPORT_TYPES = ['QIR', 'QBR', 'MIR'];