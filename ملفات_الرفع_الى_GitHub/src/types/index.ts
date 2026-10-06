export interface StudentCode {
  id: string;
  code: string;
  studentName: string;
  grade: string; // e.g. "المرحلة الثانية (صباحي)"
  group?: string; // كروب الطالب مثل "جروب A" أو "جروب B" أو "جروب C"
  phone?: string;
  guardianPhone?: string;
  city?: string;
  school?: string;
  allowedSubjectIds: string[];
  status: 'active' | 'disabled' | 'expired';
  createdAt: string;
  lastLoginAt?: string;
  notes?: string;
  maxDevices?: number;
  boundDeviceId?: string | null;
  boundDeviceName?: string | null;
  boundAt?: string | null;
  isMuted?: boolean; // هل الطالب مكتوم من الشات
}

export interface ChatMessage {
  id: string;
  senderCode: string;
  senderName: string;
  senderGrade?: string;
  senderGroup?: string; // كروب الطالب مثلاً "جروب A"
  senderRole: 'student' | 'admin';
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'link' | 'zip';
  size?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  authorName: string;
  authorRole: 'teacher' | 'student';
  text: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  lectureId: string;
  studentName: string;
  studentCode: string;
  studentGrade?: string;
  studentGroup?: string; // كروب الطالب
  isTeacher: boolean;
  text: string;
  createdAt: string;
  likes: number;
  replies: CommentReply[];
}

export interface Lecture {
  id: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoType: 'youtube' | 'vimeo' | 'direct' | 'embed';
  videoUrl: string;
  attachments: Attachment[];
  order: number;
  isFreePreview?: boolean;
  viewsCount: number;
  createdAt: string;
  semester?: 'first' | 'second'; // الكورس الأول أو الثاني
}

export interface Section {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  order: number;
  lectures: Lecture[];
  semester?: 'first' | 'second'; // الكورس الأول أو الثاني
}

export interface Subject {
  id: string;
  title: string;
  gradeLevel: string;
  icon: string;
  color: string;
  description: string;
  coverImage?: string;
  teacherName: string;
  sections: Section[];
  order: number;
  createdAt: string;
}

export interface TeacherProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  adminPin: string;
}
