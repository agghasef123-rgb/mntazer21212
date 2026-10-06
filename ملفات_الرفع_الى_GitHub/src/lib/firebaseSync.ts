'use client';

import { rtdb } from './firebase';
import { ref, onValue, set, get, update, DatabaseReference } from 'firebase/database';
import { Subject, StudentCode, Comment, TeacherProfile, ChatMessage } from '@/types';
import { initialSubjects, initialStudentCodes, initialComments, initialTeacherProfile } from './initialData';

const ROOT_PATH = 'educational_platform_petro_v1';

export const RTDB_PATHS = {
  SUBJECTS: `${ROOT_PATH}/subjects`,
  STUDENT_CODES: `${ROOT_PATH}/studentCodes`,
  COMMENTS: `${ROOT_PATH}/comments`,
  CHAT_MESSAGES: `${ROOT_PATH}/chatMessages`,
  TEACHER_PROFILE: `${ROOT_PATH}/teacherProfile`,
};

// Check if Realtime Database is ready
export const isDbReady = (): boolean => {
  return typeof window !== 'undefined' && rtdb !== null;
};

// Initialize cloud database with initial data if empty
export const initializeCloudDataIfEmpty = async () => {
  if (!isDbReady() || !rtdb) return;

  try {
    const subjectsRef = ref(rtdb, RTDB_PATHS.SUBJECTS);
    const snapshot = await get(subjectsRef);
    if (!snapshot.exists() || !snapshot.val()) {
      await set(ref(rtdb, RTDB_PATHS.SUBJECTS), initialSubjects);
      await set(ref(rtdb, RTDB_PATHS.STUDENT_CODES), initialStudentCodes);
      await set(ref(rtdb, RTDB_PATHS.COMMENTS), initialComments);
      await set(ref(rtdb, RTDB_PATHS.TEACHER_PROFILE), initialTeacherProfile);
      console.log('Firebase Database seeded with initial structure');
    }
  } catch (error) {
    console.warn('Firebase init notice:', error);
  }
};

// --- Realtime Subscriptions ---

export const subscribeToCloudSubjects = (callback: (subjects: Subject[]) => void) => {
  if (!isDbReady() || !rtdb) return () => {};
  const dbRef = ref(rtdb, RTDB_PATHS.SUBJECTS);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          callback(val.filter(Boolean));
        } else if (typeof val === 'object' && val !== null) {
          callback(Object.values(val));
        }
      }
    },
    (error) => {
      console.warn('Subjects cloud sync warning:', error);
    }
  );
};

export const subscribeToCloudStudentCodes = (callback: (codes: StudentCode[]) => void) => {
  if (!isDbReady() || !rtdb) return () => {};
  const dbRef = ref(rtdb, RTDB_PATHS.STUDENT_CODES);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          callback(val.filter(Boolean));
        } else if (typeof val === 'object' && val !== null) {
          callback(Object.values(val));
        }
      }
    },
    (error) => {
      console.warn('Student codes cloud sync warning:', error);
    }
  );
};

export const subscribeToCloudComments = (callback: (comments: Comment[]) => void) => {
  if (!isDbReady() || !rtdb) return () => {};
  const dbRef = ref(rtdb, RTDB_PATHS.COMMENTS);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          callback(val.filter(Boolean));
        } else if (typeof val === 'object' && val !== null) {
          callback(Object.values(val));
        }
      }
    },
    (error) => {
      console.warn('Comments cloud sync warning:', error);
    }
  );
};

export const subscribeToCloudChatMessages = (callback: (messages: ChatMessage[]) => void) => {
  if (!isDbReady() || !rtdb) return () => {};
  const dbRef = ref(rtdb, RTDB_PATHS.CHAT_MESSAGES);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          callback(val.filter(Boolean));
        } else if (typeof val === 'object' && val !== null) {
          callback(Object.values(val));
        }
      }
    },
    (error) => {
      console.warn('Chat cloud sync warning:', error);
    }
  );
};

export const subscribeToCloudTeacherProfile = (callback: (profile: TeacherProfile) => void) => {
  if (!isDbReady() || !rtdb) return () => {};
  const dbRef = ref(rtdb, RTDB_PATHS.TEACHER_PROFILE);
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val) callback(val);
      }
    },
    (error) => {
      console.warn('Teacher profile cloud sync warning:', error);
    }
  );
};

// --- Cloud Write Mutations ---

export const saveCloudSubjects = async (subjects: Subject[]) => {
  if (!isDbReady() || !rtdb) return;
  try {
    await set(ref(rtdb, RTDB_PATHS.SUBJECTS), subjects);
  } catch (e) {
    console.error('Failed to save subjects to Firebase', e);
  }
};

export const saveCloudStudentCodes = async (codes: StudentCode[]) => {
  if (!isDbReady() || !rtdb) return;
  try {
    await set(ref(rtdb, RTDB_PATHS.STUDENT_CODES), codes);
  } catch (e) {
    console.error('Failed to save student codes to Firebase', e);
  }
};

export const saveCloudComments = async (comments: Comment[]) => {
  if (!isDbReady() || !rtdb) return;
  try {
    await set(ref(rtdb, RTDB_PATHS.COMMENTS), comments);
  } catch (e) {
    console.error('Failed to save comments to Firebase', e);
  }
};

export const saveCloudChatMessages = async (messages: ChatMessage[]) => {
  if (!isDbReady() || !rtdb) return;
  try {
    await set(ref(rtdb, RTDB_PATHS.CHAT_MESSAGES), messages);
  } catch (e) {
    console.error('Failed to save chat messages to Firebase', e);
  }
};

export const saveCloudTeacherProfile = async (profile: TeacherProfile) => {
  if (!isDbReady() || !rtdb) return;
  try {
    await set(ref(rtdb, RTDB_PATHS.TEACHER_PROFILE), profile);
  } catch (e) {
    console.error('Failed to save teacher profile to Firebase', e);
  }
};
