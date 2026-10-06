import { Subject, StudentCode, Comment, TeacherProfile, Lecture, Section, ChatMessage } from '@/types';
import { initialSubjects, initialStudentCodes, initialComments, initialTeacherProfile } from './initialData';

const STORAGE_KEYS = {
  SUBJECTS: 'edu_platform_subjects_petro_clean_v7',
  STUDENT_CODES: 'edu_platform_codes_petro_clean_v7',
  COMMENTS: 'edu_platform_comments_petro_clean_v7',
  CHAT_MESSAGES: 'edu_platform_chat_messages_v1',
  TEACHER_PROFILE: 'edu_platform_teacher_petro_clean_v7',
  CURRENT_STUDENT: 'edu_platform_current_student_petro_clean_v7',
  ADMIN_AUTH: 'edu_platform_admin_auth_petro_clean_v7',
};

export const sanitizeSubjects = (subs: Subject[]): Subject[] => {
  return subs.map((s) => {
    let desc = s.description || '';
    if (desc.includes('بإشراف') || desc.includes('الأحد') || desc.includes('الأثنين') || desc.includes('الخميس') || desc.includes('(')) {
      const match = initialSubjects.find((i) => i.id === s.id);
      desc = match ? match.description : 'المحاضرات والشيتات الهندسية ومسائل المادة.';
    }
    return {
      ...s,
      description: desc,
      teacherName: '',
    };
  });
};

// Safe LocalStorage helpers (SSR friendly)
export const getStoredSubjects = (): Subject[] => {
  if (typeof window === 'undefined') return initialSubjects;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
      return initialSubjects;
    }
    const parsed = JSON.parse(data);
    const sanitized = sanitizeSubjects(parsed);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(sanitized));
    return sanitized;
  } catch (e) {
    console.error('Failed to get subjects', e);
    return initialSubjects;
  }
};

export const saveStoredSubjects = (subjects: Subject[]) => {
  if (typeof window === 'undefined') return;
  const sanitized = sanitizeSubjects(subjects);
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(sanitized));
};

export const getStoredCodes = (): StudentCode[] => {
  if (typeof window === 'undefined') return initialStudentCodes;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_CODES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_CODES, JSON.stringify(initialStudentCodes));
      return initialStudentCodes;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get codes', e);
    return initialStudentCodes;
  }
};

export const saveStoredCodes = (codes: StudentCode[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STUDENT_CODES, JSON.stringify(codes));
};

export const getStoredComments = (): Comment[] => {
  if (typeof window === 'undefined') return initialComments;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
      return initialComments;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get comments', e);
    return initialComments;
  }
};

export const saveStoredComments = (comments: Comment[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

export const getStoredChatMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (!data) {
      const initialChat: ChatMessage[] = [
        {
          id: 'chat-welcome',
          senderCode: 'ADMIN',
          senderName: 'إدارة القسم',
          senderGrade: 'لوحة الإدارة',
          senderRole: 'admin',
          text: 'أهلاً بكم في غرفة محادثة طلاب قسم هندسة تكرير النفط والغاز 🛢️. مساحة لتبادل الأسئلة، الشيتات، والمناقشات العلمية.',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(initialChat));
      return initialChat;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveStoredChatMessages = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
};

export const getStoredTeacherProfile = (): TeacherProfile => {
  if (typeof window === 'undefined') return initialTeacherProfile;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(initialTeacherProfile));
      return initialTeacherProfile;
    }
    const parsed: TeacherProfile = JSON.parse(data);
    if (parsed.adminPin === '1234' || !parsed.adminPin) {
      parsed.adminPin = 'Joker1';
      parsed.name = 'المسؤول';
      localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Failed to get teacher profile', e);
    return initialTeacherProfile;
  }
};

export const saveStoredTeacherProfile = (profile: TeacherProfile) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(profile));
};

export const getCurrentStudentSession = (): StudentCode | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentStudentSession = (student: StudentCode | null) => {
  if (typeof window === 'undefined') return;
  if (student) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  }
};

export const getAdminAuthSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuthSession = (isAuth: boolean) => {
  if (typeof window === 'undefined') return;
  if (isAuth) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

// Reset to factory demo data
export const resetToInitialData = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
  localStorage.setItem(STORAGE_KEYS.STUDENT_CODES, JSON.stringify(initialStudentCodes));
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
  localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(initialTeacherProfile));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
};
