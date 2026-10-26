// ==========================================================================
// APAG SIS | Hệ thống cố vấn thông minh - Domain Models & Interfaces
// ==========================================================================

export type UserRole = 'student' | 'advisor' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  fullName?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  cohort?: string;
  class?: string;
  major?: string;
  faculty?: string;
  dob?: string;
  hometown?: string;
  gender?: string;
  ethnicity?: string;
  trainingType?: string;
  phone?: string;
  advisorId?: string;
  advisorName?: string;
  gpa?: number;
  credits?: number;
  totalCredits?: number;
  progress?: number;
  status?: string;
  title?: string;
  department?: string;
  office?: string;
  assignedStudents?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  credits: number;
  theoryCredits?: number;
  practicalCredits?: number;
  department?: string;
  instructor?: string;
  prerequisites?: string[];
  parallelCourses?: string[];
  semester?: number;
  type?: 'compulsory' | 'elective' | 'condition';
  knowledgeBlock?: string;
  description?: string;
  status?: string;
  midGrade?: number | string;
  finalGrade?: number | string;
}

export interface EnrolledCourse {
  code: string;
  name: string;
  credits: number;
  midGrade?: number | string;
  instructor?: string;
  status: string;
}

export interface KnowledgeBlock {
  id: string;
  name: string;
  completedCredits: number;
  totalCredits: number;
  percentage: number;
}

export interface GpaRecord {
  semester: string;
  semesterGpa: number;
  cumulativeGpa: number;
  creditsEarned: number;
}

export interface StudentAlert {
  id: string;
  studentId: string;
  studentName?: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  date: string;
  resolved: boolean;
  resolutionNote?: string;
  actionRequired?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'system' | 'advisor' | 'deadline';
  date: string;
  read: boolean;
  link?: string;
  severity?: 'info' | 'warning' | 'danger' | 'success';
}

export interface WhatIfCandidate {
  code: string;
  name: string;
  credits: number;
  block: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AcademicDeadline {
  id: string;
  title: string;
  date: string;
  timeRemaining: string;
  type: string;
}

export interface ClassPerformanceItem {
  id: number;
  name: string;
  students: number;
  gpa: number;
  gpaPrev: number;
  passRate: number;
  passCount: number;
  alertRate: number;
  alertCount: number;
  completionRate: number;
}
