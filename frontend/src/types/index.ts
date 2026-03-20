// All TypeScript interfaces for the Legal FIR Management System

export interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface FIR {
  id: number;
  userId: number;
  userName: string;
  title: string;
  description: string;
  location: string;
  incidentDate: string;
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'CLOSED';
  createdAt: string;
}

export interface LegalSection {
  id: number;
  code: string;
  title: string;
  description: string;
  actType: 'IPC' | 'CrPC';
  isBailable: boolean;
}

export interface Case {
  id: number;
  firId: number;
  firTitle: string;
  userId: number;
  userName: string;
  title: string;
  status: 'OPEN' | 'ACTIVE' | 'CLOSED';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  logs?: CaseLog[];
}

export interface CaseLog {
  id: number;
  caseId: number;
  note: string;
  createdAt: string;
}

export interface Document {
  id: number;
  caseId: number;
  userId: number;
  userName: string;
  fileName: string;
  uploadedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportSummary {
  totalFIRs: number;
  totalCases: number;
  totalUsers: number;
}

export interface AuthContextType {
  user: { id: number; name: string; email: string; role: string } | null;
  token: string | null;
  login: (token: string, role: string, userId: number, name: string) => void;
  logout: () => void;
  isAdmin: boolean;
}
