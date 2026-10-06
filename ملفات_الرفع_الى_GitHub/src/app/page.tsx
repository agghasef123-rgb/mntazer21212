'use client';

import React, { useState, useEffect } from 'react';
import { Subject, Section, Lecture, StudentCode, Comment, TeacherProfile, ChatMessage } from '@/types';
import {
  getStoredSubjects,
  saveStoredSubjects,
  getStoredCodes,
  saveStoredCodes,
  getStoredComments,
  saveStoredComments,
  getStoredChatMessages,
  saveStoredChatMessages,
  getStoredTeacherProfile,
  saveStoredTeacherProfile,
  getCurrentStudentSession,
  setCurrentStudentSession,
  getAdminAuthSession,
  setAdminAuthSession,
  resetToInitialData,
} from '@/lib/storage';

import {
  initializeCloudDataIfEmpty,
  subscribeToCloudSubjects,
  subscribeToCloudStudentCodes,
  subscribeToCloudComments,
  subscribeToCloudChatMessages,
  subscribeToCloudTeacherProfile,
  saveCloudSubjects,
  saveCloudStudentCodes,
  saveCloudComments,
  saveCloudChatMessages,
  saveCloudTeacherProfile,
} from '@/lib/firebaseSync';

import Navbar from '@/components/Navbar';
import LandingGatewayView from '@/components/LandingGatewayView';
import StudentPortalView from '@/components/StudentPortalView';
import SubjectDetailView from '@/components/SubjectDetailView';
import LecturePlayer from '@/components/LecturePlayer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import StudentLoginModal from '@/components/StudentLoginModal';
import AdminAuthModal from '@/components/AdminAuthModal';
import StudentChatRoom from '@/components/StudentChatRoom';
import { MessageSquare, Cloud } from 'lucide-react';

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentCodes, setStudentCodes] = useState<StudentCode[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);

  const [currentStudent, setCurrentStudent] = useState<StudentCode | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [activeView, setActiveView] = useState<'home' | 'subject' | 'lecture' | 'admin'>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data on client mount + Subscribe to Firebase Realtime Database
  useEffect(() => {
    try {
      localStorage.removeItem('edu_platform_subjects_v1');
      localStorage.removeItem('edu_platform_subjects_petro_v2');
      localStorage.removeItem('edu_platform_subjects_petro_timetable_v4');
      localStorage.removeItem('edu_platform_subjects_petro_clean_v5');
    } catch (e) {}

    // 1. Initial load from local cache for instant UI rendering
    const s = getStoredSubjects();
    const c = getStoredCodes();
    const com = getStoredComments();
    const chat = getStoredChatMessages();
    const t = getStoredTeacherProfile();
    const stSession = getCurrentStudentSession();
    const admSession = getAdminAuthSession();

    setSubjects(s);
    setStudentCodes(c);
    setComments(com);
    setChatMessages(chat);
    setTeacherProfile(t);
    setCurrentStudent(stSession);
    setIsAdmin(admSession);
    setIsLoaded(true);

    // 2. Initialize Firebase Cloud data if needed
    initializeCloudDataIfEmpty();

    // 3. Setup Realtime Listeners with Firebase
    const unsubSubjects = subscribeToCloudSubjects((cloudSubjects) => {
      if (cloudSubjects && cloudSubjects.length > 0) {
        setSubjects(cloudSubjects);
        saveStoredSubjects(cloudSubjects);
      }
      setIsCloudConnected(true);
    });

    const unsubCodes = subscribeToCloudStudentCodes((cloudCodes) => {
      if (cloudCodes && cloudCodes.length > 0) {
        setStudentCodes(cloudCodes);
        saveStoredCodes(cloudCodes);
        // Refresh active student session if code changed or was muted/reset
        const activeSt = getCurrentStudentSession();
        if (activeSt) {
          const fresh = cloudCodes.find((item) => item.id === activeSt.id);
          if (fresh) {
            setCurrentStudent(fresh);
            setCurrentStudentSession(fresh);
          }
        }
      }
      setIsCloudConnected(true);
    });

    const unsubComments = subscribeToCloudComments((cloudComments) => {
      if (cloudComments) {
        setComments(cloudComments);
        saveStoredComments(cloudComments);
      }
    });

    const unsubChat = subscribeToCloudChatMessages((cloudChat) => {
      if (cloudChat) {
        setChatMessages(cloudChat);
        saveStoredChatMessages(cloudChat);
      }
    });

    const unsubProfile = subscribeToCloudTeacherProfile((cloudProfile) => {
      if (cloudProfile && cloudProfile.name) {
        setTeacherProfile(cloudProfile);
        saveStoredTeacherProfile(cloudProfile);
      }
    });

    // Check hash for admin
    if (window.location.hash === '#admin') {
      if (admSession) {
        setActiveView('admin');
      } else {
        setIsAdminAuthOpen(true);
      }
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        const authed = getAdminAuthSession();
        if (authed) {
          setActiveView('admin');
        } else {
          setIsAdminAuthOpen(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (unsubSubjects) unsubSubjects();
      if (unsubCodes) unsubCodes();
      if (unsubComments) unsubComments();
      if (unsubChat) unsubChat();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // Update handlers with Cloud Sync
  const handleUpdateSubjects = (newSubs: Subject[]) => {
    setSubjects(newSubs);
    saveStoredSubjects(newSubs);
    saveCloudSubjects(newSubs);
  };

  const handleUpdateCodes = (newCodes: StudentCode[]) => {
    setStudentCodes(newCodes);
    saveStoredCodes(newCodes);
    saveCloudStudentCodes(newCodes);
    if (currentStudent) {
      const refreshed = newCodes.find((c) => c.id === currentStudent.id);
      if (refreshed) {
        setCurrentStudent(refreshed);
        setCurrentStudentSession(refreshed);
      }
    }
  };

  const handleUpdateComments = (newComments: Comment[]) => {
    setComments(newComments);
    saveStoredComments(newComments);
    saveCloudComments(newComments);
  };

  const handleUpdateTeacherProfile = (prof: TeacherProfile) => {
    setTeacherProfile(prof);
    saveStoredTeacherProfile(prof);
    saveCloudTeacherProfile(prof);
  };

  const handleResetData = () => {
    resetToInitialData();
    window.location.reload();
  };

  // Student auth
  const handleStudentLoginSuccess = (student: StudentCode) => {
    const updated = studentCodes.map((c) =>
      c.id === student.id ? { ...c, lastLoginAt: new Date().toISOString() } : c
    );
    handleUpdateCodes(updated);
    const refreshed = updated.find((c) => c.id === student.id) || student;
    setCurrentStudent(refreshed);
    setCurrentStudentSession(refreshed);
    setActiveView('home');
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setCurrentStudentSession(null);
    setActiveView('home');
    setSelectedSubject(null);
    setSelectedSection(null);
    setSelectedLecture(null);
  };

  // Admin auth
  const handleAdminAuthSuccess = () => {
    setIsAdmin(true);
    setAdminAuthSession(true);
    setActiveView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminAuthSession(false);
    if (activeView === 'admin') {
      setActiveView('home');
      window.location.hash = '';
    }
  };

  // Navigation handlers
  const handleNavigateHome = () => {
    setActiveView('home');
    setSelectedSubject(null);
    setSelectedSection(null);
    setSelectedLecture(null);
    window.location.hash = '';
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setActiveView('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLecture = (section: Section, lecture: Lecture) => {
    setSelectedSection(section);
    setSelectedLecture(lecture);
    setActiveView('lecture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Comments interaction
  const handleAddComment = (text: string) => {
    if (!selectedLecture) return;

    const newComment: Comment = {
      id: `com-${Date.now()}`,
      lectureId: selectedLecture.id,
      studentName: isAdmin
        ? 'المسؤول'
        : currentStudent?.studentName || 'طالب',
      studentCode: currentStudent?.code || 'ADMIN',
      studentGrade: currentStudent?.grade,
      studentGroup: currentStudent?.group || (currentStudent?.city ? `جروب ${currentStudent.city}` : 'جروب A'),
      isTeacher: isAdmin,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    handleUpdateComments([newComment, ...comments]);
  };

  const handleAddReply = (commentId: string, text: string) => {
    const updated = comments.map((c) => {
      if (c.id !== commentId) return c;
      return {
        ...c,
        replies: [
          ...c.replies,
          {
            id: `rep-${Date.now()}`,
            commentId,
            authorName: isAdmin
              ? 'المسؤول'
              : currentStudent?.studentName || 'طالب',
            authorRole: (isAdmin ? 'teacher' : 'student') as 'teacher' | 'student',
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });

    handleUpdateComments(updated);
  };

  // -------------------------------------------------------------
  // Chat Room Actions & Mute Moderation
  // -------------------------------------------------------------
  const handleSendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderCode: isAdmin ? 'ADMIN' : currentStudent?.code || 'GUEST',
      senderName: isAdmin ? 'المسؤول' : currentStudent?.studentName || 'طالب',
      senderGrade: isAdmin ? 'المسؤول' : currentStudent?.grade,
      senderGroup: isAdmin ? 'المسؤول' : currentStudent?.group || (currentStudent?.city ? `جروب ${currentStudent.city}` : 'جروب A'),
      senderRole: isAdmin ? 'admin' : 'student',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveStoredChatMessages(updated);
    saveCloudChatMessages(updated);
  };

  const handleDeleteChatMessage = (id: string) => {
    const updated = chatMessages.filter((m) => m.id !== id);
    setChatMessages(updated);
    saveStoredChatMessages(updated);
    saveCloudChatMessages(updated);
  };

  const handleToggleMuteStudent = (studentCode: string) => {
    const target = studentCodes.find((s) => s.code === studentCode);
    if (!target) return;

    const newMutedState = !target.isMuted;
    const updatedCodes = studentCodes.map((s) =>
      s.code === studentCode ? { ...s, isMuted: newMutedState } : s
    );

    handleUpdateCodes(updatedCodes);
    alert(
      newMutedState
        ? `تم كتم الطالب (${target.studentName}) بنجاح. لن يتمكن من إرسال رسائل في المحادثة.`
        : `تم إلغاء كتم الطالب (${target.studentName}) بنجاح.`
    );
  };

  const handleClearChat = () => {
    setChatMessages([]);
    saveStoredChatMessages([]);
    saveCloudChatMessages([]);
  };

  if (!isLoaded || !teacherProfile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">جاري تحميل المنصة التعليمية...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not admin, show the ultra-clean Gateway Portal
  const isAuthenticated = currentStudent !== null || isAdmin;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentStudent={currentStudent}
        isAdmin={isAdmin}
        teacherProfile={teacherProfile}
        activeView={activeView}
        isCloudConnected={isCloudConnected}
        onNavigateHome={handleNavigateHome}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onStudentLogout={handleStudentLogout}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {!isAuthenticated ? (
          // 🔒 Secure Gateway: Code Entry (No public cards shown)
          <LandingGatewayView
            availableCodes={studentCodes}
            subjects={subjects}
            onSuccessLogin={handleStudentLoginSuccess}
            onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
          />
        ) : (
          // 🎓 Authenticated Student / Admin Portal
          <>
            {activeView === 'home' && (
              <StudentPortalView
                subjects={subjects}
                currentStudent={
                  currentStudent || {
                    id: 'admin-preview',
                    code: 'ADMIN-VIEW',
                    studentName: 'المسؤول (معاينة شاملة)',
                    grade: 'لوحة المسؤول',
                    phone: '',
                    city: 'البصرة',
                    school: 'قسم هندسة تكرير النفط والغاز',
                    allowedSubjectIds: [],
                    status: 'active',
                    createdAt: new Date().toISOString(),
                  }
                }
                isAdmin={isAdmin}
                onSelectSubject={handleSelectSubject}
                onStudentLogout={handleStudentLogout}
              />
            )}

            {activeView === 'subject' && selectedSubject && (
              <SubjectDetailView
                subject={selectedSubject}
                currentStudent={currentStudent}
                isAdmin={isAdmin}
                onSelectLecture={handleSelectLecture}
                onBack={handleNavigateHome}
                onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
              />
            )}

            {activeView === 'lecture' && selectedSubject && selectedSection && selectedLecture && (
              <LecturePlayer
                subject={selectedSubject}
                currentSection={selectedSection}
                currentLecture={selectedLecture}
                currentStudent={currentStudent}
                isAdmin={isAdmin}
                comments={comments}
                onSelectLecture={handleSelectLecture}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
                onBackToSubject={() => setActiveView('subject')}
                onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
              />
            )}

            {activeView === 'admin' && (
              <AdminDashboard
                subjects={subjects}
                studentCodes={studentCodes}
                comments={comments}
                teacherProfile={teacherProfile}
                onUpdateSubjects={handleUpdateSubjects}
                onUpdateCodes={handleUpdateCodes}
                onUpdateComments={handleUpdateComments}
                onUpdateTeacherProfile={handleUpdateTeacherProfile}
                onResetData={handleResetData}
                onCloseDashboard={handleNavigateHome}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Chat Trigger Button (Available for authenticated students & admin) */}
      {isAuthenticated && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold px-4 sm:px-5 py-3.5 rounded-full shadow-2xl shadow-amber-600/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-amber-400/30 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -top-1 -right-1 animate-ping" />
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -top-1 -right-1" />
          </div>
          <span className="text-xs sm:text-sm">محادثة طلاب القسم</span>
        </button>
      )}

      {/* Chat Room Modal / Drawer */}
      <StudentChatRoom
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        currentStudent={currentStudent}
        isAdmin={isAdmin}
        onSendMessage={handleSendChatMessage}
        onDeleteMessage={handleDeleteChatMessage}
        onToggleMuteStudent={handleToggleMuteStudent}
        onClearChat={handleClearChat}
        allStudents={studentCodes}
      />

      {/* Modals */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        availableCodes={studentCodes}
        subjects={subjects}
        onSuccessLogin={handleStudentLoginSuccess}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        adminPin={teacherProfile.adminPin}
        onSuccessAdminAuth={handleAdminAuthSuccess}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-1.5">
        <p className="font-bold text-slate-300">
          منصة قسم هندسة تكرير النفط والغاز © {new Date().getFullYear()}
        </p>
        <p className="text-amber-400/90 font-mono text-xs font-semibold tracking-wider">
          Dev: Muntadhar Haitham
        </p>
      </footer>

    </div>
  );
}
