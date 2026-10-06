'use client';

import React, { useState } from 'react';
import { Subject, Section, Lecture, StudentCode, Comment, TeacherProfile, Attachment } from '@/types';
import { generateStudentCode, createWhatsAppShareLink, formatArabicDate } from '@/lib/utils';
import { 
  Users, 
  KeyRound, 
  BookOpen, 
  Layers, 
  PlaySquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Share2, 
  Search, 
  Filter, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowLeft, 
  FileText, 
  Video, 
  Save, 
  X,
  Phone,
  School,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  RotateCcw,
  Smartphone,
  UploadCloud,
  FileUp,
  Film,
  Link2,
  Loader2
} from 'lucide-react';

interface AdminDashboardProps {
  subjects: Subject[];
  studentCodes: StudentCode[];
  comments: Comment[];
  teacherProfile: TeacherProfile;
  onUpdateSubjects: (subs: Subject[]) => void;
  onUpdateCodes: (codes: StudentCode[]) => void;
  onUpdateComments: (comms: Comment[]) => void;
  onUpdateTeacherProfile: (prof: TeacherProfile) => void;
  onResetData: () => void;
  onCloseDashboard: () => void;
}

export default function AdminDashboard({
  subjects,
  studentCodes,
  comments,
  teacherProfile,
  onUpdateSubjects,
  onUpdateCodes,
  onUpdateComments,
  onUpdateTeacherProfile,
  onResetData,
  onCloseDashboard,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'codes' | 'courses' | 'qa' | 'settings'>('codes');

  // --- Student Codes State ---
  const [isNewCodeModalOpen, setIsNewCodeModalOpen] = useState(false);
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [codeSearch, setCodeSearch] = useState('');
  const [codeFilterGrade, setCodeFilterGrade] = useState('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // New/Edit Code Form state
  const [formData, setFormData] = useState({
    studentName: '',
    grade: 'المرحلة الرابعة (صباحي)',
    group: 'جروب A (Group A)',
    school: 'قسم هندسة تكرير النفط والغاز',
    allowedSubjectIds: [] as string[],
    customCode: '',
    status: 'active' as 'active' | 'disabled' | 'expired',
    notes: '',
  });

  // --- Course & Lecture Manager State ---
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);
  const [isNewSectionModalOpen, setIsNewSectionModalOpen] = useState(false);
  const [isNewLectureModalOpen, setIsNewLectureModalOpen] = useState(false);
  const [targetSectionIdForLecture, setTargetSectionIdForLecture] = useState<string>('');

  // New Subject Form
  const [subjectForm, setSubjectForm] = useState({
    title: '',
    gradeLevel: 'السادس الإعدادي (العلمي)',
    icon: '📐',
    description: '',
  });

  // New Section Form
  const [sectionForm, setSectionForm] = useState({
    title: '',
    description: '',
    semester: 'first' as 'first' | 'second',
  });

  // New Lecture Form
  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    durationMinutes: 40,
    videoUrl: '',
    isFreePreview: false,
    pdfTitle: '',
    pdfUrl: '',
  });

  // Lecture upload options & state
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'url'>('upload');
  const [pdfSourceType, setPdfSourceType] = useState<'upload' | 'url'>('upload');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [uploadedVideoInfo, setUploadedVideoInfo] = useState<{ name: string; size: string } | null>(null);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState<{ name: string; size: string } | null>(null);

  // Q&A reply text state
  const [qaReplies, setQaReplies] = useState<{ [key: string]: string }>({});

  // -------------------------------------------------------------
  // Student Code Actions
  // -------------------------------------------------------------
  const handleOpenNewCodeModal = () => {
    setEditingCodeId(null);
    setFormData({
      studentName: '',
      grade: 'المرحلة الرابعة (صباحي)',
      group: 'جروب A (Group A)',
      school: 'قسم هندسة تكرير النفط والغاز',
      allowedSubjectIds: subjects.map((s) => s.id), // All subjects unlocked by default
      customCode: generateStudentCode('PETRO', 'ENG'),
      status: 'active',
      notes: '',
    });
    setIsNewCodeModalOpen(true);
  };

  const handleEditCode = (sc: StudentCode) => {
    setEditingCodeId(sc.id);
    setFormData({
      studentName: sc.studentName,
      grade: sc.grade,
      group: sc.group || (sc.city ? `جروب ${sc.city}` : 'جروب A (Group A)'),
      school: sc.school || 'قسم هندسة تكرير النفط والغاز',
      allowedSubjectIds: sc.allowedSubjectIds,
      customCode: sc.code,
      status: sc.status,
      notes: sc.notes || '',
    });
    setIsNewCodeModalOpen(true);
  };

  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.customCode.trim()) {
      alert('يرجى ملء اسم الطالب وكود الدخول');
      return;
    }

    if (editingCodeId) {
      const updated = studentCodes.map((c) =>
        c.id === editingCodeId
          ? {
              ...c,
              studentName: formData.studentName.trim(),
              grade: formData.grade,
              group: formData.group.trim(),
              school: formData.school.trim(),
              allowedSubjectIds: formData.allowedSubjectIds,
              code: formData.customCode.trim().toUpperCase(),
              status: formData.status,
              notes: formData.notes.trim(),
            }
          : c
      );
      onUpdateCodes(updated);
    } else {
      const newCode: StudentCode = {
        id: `code-${Date.now()}`,
        studentName: formData.studentName.trim(),
        grade: formData.grade,
        group: formData.group.trim(),
        school: formData.school.trim(),
        allowedSubjectIds: formData.allowedSubjectIds,
        code: formData.customCode.trim().toUpperCase(),
        status: formData.status,
        createdAt: new Date().toISOString(),
        notes: formData.notes.trim(),
      };
      onUpdateCodes([newCode, ...studentCodes]);
    }

    setIsNewCodeModalOpen(false);
  };

  const handleDeleteCode = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟ لن يتمكن الطالب من الدخول بعد الحذف.')) {
      onUpdateCodes(studentCodes.filter((c) => c.id !== id));
    }
  };

  const handleToggleCodeStatus = (id: string) => {
    onUpdateCodes(
      studentCodes.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' }
          : c
      )
    );
  };

  // Reset Student Device Binding
  const handleResetDevice = (id: string, studentName: string) => {
    if (
      confirm(
        `هل تريد ترسيت وإلغاء ربط الجهاز للطالب (${studentName})؟\nسيتمكن الطالب من استخدام الكود وتفعيله مجدداً على جهازه الجديد.`
      )
    ) {
      onUpdateCodes(
        studentCodes.map((c) =>
          c.id === id
            ? {
                ...c,
                boundDeviceId: null,
                boundDeviceName: null,
                boundAt: null,
              }
            : c
        )
      );
      alert(`تم ترسيت الكود بنجاح! يمكن لـ ${studentName} الدخول الآن من أي جهاز جديد.`);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // -------------------------------------------------------------
  // Course & Lecture Actions
  // -------------------------------------------------------------
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.title.trim()) return;

    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      title: subjectForm.title.trim(),
      gradeLevel: subjectForm.gradeLevel,
      icon: subjectForm.icon || '📚',
      color: 'from-blue-600 to-indigo-700',
      description: subjectForm.description.trim() || 'شرح المنهج الأكاديمي كاملاً مع الملازم والشيتات.',
      teacherName: teacherProfile.name,
      order: subjects.length + 1,
      createdAt: new Date().toISOString(),
      sections: [],
    };

    const updated = [...subjects, newSub];
    onUpdateSubjects(updated);
    setSelectedSubjectId(newSub.id);
    setIsNewSubjectModalOpen(false);
    setSubjectForm({ title: '', gradeLevel: 'هندسة تكرير النفط والغاز', icon: '📐', description: '' });
  };

  const handleDeleteSubject = (subId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المادة وجميع فصولها ومحاضراتها؟')) {
      const updated = subjects.filter((s) => s.id !== subId);
      onUpdateSubjects(updated);
      if (selectedSubjectId === subId && updated.length > 0) {
        setSelectedSubjectId(updated[0].id);
      }
    }
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title.trim() || !currentSubject) return;

    const newSec: Section = {
      id: `sec-${Date.now()}`,
      subjectId: currentSubject.id,
      title: sectionForm.title.trim(),
      description: sectionForm.description.trim(),
      semester: sectionForm.semester,
      order: currentSubject.sections.length + 1,
      lectures: [],
    };

    const updated = subjects.map((s) =>
      s.id === currentSubject.id
        ? { ...s, sections: [...s.sections, newSec] }
        : s
    );

    onUpdateSubjects(updated);
    setIsNewSectionModalOpen(false);
    setSectionForm({ title: '', description: '', semester: 'first' });
  };

  const handleDeleteSection = (secId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفصل بجميع محاضراته؟')) {
      const updated = subjects.map((s) =>
        s.id === currentSubject.id
          ? { ...s, sections: s.sections.filter((sec) => sec.id !== secId) }
          : s
      );
      onUpdateSubjects(updated);
    }
  };

  const handleOpenNewLectureModal = (sectionId: string) => {
    setTargetSectionIdForLecture(sectionId);
    setLectureForm({
      title: '',
      description: '',
      durationMinutes: 40,
      videoUrl: '',
      isFreePreview: false,
      pdfTitle: '',
      pdfUrl: '',
    });
    setVideoSourceType('upload');
    setPdfSourceType('upload');
    setUploadedVideoInfo(null);
    setUploadedPdfInfo(null);
    setIsNewLectureModalOpen(true);
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVideoUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'فشل رفع الفيديو');
      }

      setLectureForm((prev) => ({
        ...prev,
        videoUrl: result.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));
      setUploadedVideoInfo({ name: file.name, size: result.size });
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء رفع الفيديو');
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPdfUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'فشل رفع ملف PDF');
      }

      setLectureForm((prev) => ({
        ...prev,
        pdfUrl: result.url,
        pdfTitle: prev.pdfTitle || file.name.replace(/\.[^/.]+$/, ''),
      }));
      setUploadedPdfInfo({ name: file.name, size: result.size });
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء رفع ملف PDF');
    } finally {
      setIsPdfUploading(false);
    }
  };

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureForm.title.trim() || !lectureForm.videoUrl.trim() || !currentSubject) {
      alert('يرجى كتابة عنوان المحاضرة ورابط الفيديو');
      return;
    }

    const attachments: Attachment[] = [];
    if (lectureForm.pdfTitle.trim()) {
      attachments.push({
        id: `att-${Date.now()}`,
        title: lectureForm.pdfTitle.trim(),
        fileUrl: lectureForm.pdfUrl.trim() || '#',
        fileType: 'pdf',
        size: 'ملزمة PDF',
      });
    }

    const newLec: Lecture = {
      id: `lec-${Date.now()}`,
      sectionId: targetSectionIdForLecture,
      subjectId: currentSubject.id,
      title: lectureForm.title.trim(),
      description: lectureForm.description.trim(),
      durationMinutes: Number(lectureForm.durationMinutes) || 30,
      videoType: 'youtube',
      videoUrl: lectureForm.videoUrl.trim(),
      attachments,
      order: 99,
      isFreePreview: lectureForm.isFreePreview,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = subjects.map((s) => {
      if (s.id !== currentSubject.id) return s;
      return {
        ...s,
        sections: s.sections.map((sec) => {
          if (sec.id !== targetSectionIdForLecture) return sec;
          return { ...sec, lectures: [...sec.lectures, newLec] };
        }),
      };
    });

    onUpdateSubjects(updated);
    setIsNewLectureModalOpen(false);
  };

  const handleDeleteLecture = (secId: string, lecId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المحاضرة؟')) {
      const updated = subjects.map((s) => {
        if (s.id !== currentSubject.id) return s;
        return {
          ...s,
          sections: s.sections.map((sec) => {
            if (sec.id !== secId) return sec;
            return {
              ...sec,
              lectures: sec.lectures.filter((lec) => lec.id !== lecId),
            };
          }),
        };
      });
      onUpdateSubjects(updated);
    }
  };

  // -------------------------------------------------------------
  // Q&A Teacher Reply Actions
  // -------------------------------------------------------------
  const handleTeacherReply = (commentId: string) => {
    const text = qaReplies[commentId];
    if (!text || !text.trim()) return;

    const updated = comments.map((c) => {
      if (c.id !== commentId) return c;
      return {
        ...c,
        replies: [
          ...c.replies,
          {
            id: `rep-${Date.now()}`,
            commentId,
            authorName: teacherProfile.name,
            authorRole: 'teacher' as const,
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });

    onUpdateComments(updated);
    setQaReplies((prev) => ({ ...prev, [commentId]: '' }));
  };

  // Filtered Codes
  const filteredCodes = studentCodes.filter((sc) => {
    const matchesSearch =
      sc.studentName.toLowerCase().includes(codeSearch.toLowerCase()) ||
      sc.code.toLowerCase().includes(codeSearch.toLowerCase()) ||
      (sc.group && sc.group.toLowerCase().includes(codeSearch.toLowerCase())) ||
      (sc.school && sc.school.toLowerCase().includes(codeSearch.toLowerCase()));
    const matchesGrade = codeFilterGrade === 'all' || sc.grade === codeFilterGrade;
    return matchesSearch && matchesGrade;
  });

  const totalLecturesCount = subjects.reduce(
    (acc, s) => acc + s.sections.reduce((lAcc, sec) => lAcc + sec.lectures.length, 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" dir="rtl">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>لوحة تحكم المسؤول</span>
              <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                إدارة كاملة
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              إصدار الأكواد، رفع وإدارة المحاضرات والأقسام، والرد على أسئلة الطلاب
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onCloseDashboard}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>معاينة المنصة كطالب</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('codes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'codes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>إدارة وأكواد الطلاب ({studentCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>رفع وإدارة المحاضرات والمواد ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'qa'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>استفسارات وأسئلة الطلاب ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>الإحصائيات العامة</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>الملف الشخصي والضبط</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: STUDENT CODES MANAGER                                  */}
      {/* ============================================================== */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  placeholder="بحث باسم الطالب، الكود، المرحلة أو الكروب..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={codeFilterGrade}
                onChange={(e) => setCodeFilterGrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">كافة المراحل الجامعية</option>
                <option value="المرحلة الرابعة (صباحي)">المرحلة الرابعة (صباحي)</option>
                <option value="المرحلة الرابعة (مسائي)">المرحلة الرابعة (مسائي)</option>
                <option value="المرحلة الثالثة (صباحي)">المرحلة الثالثة (صباحي)</option>
                <option value="المرحلة الثالثة (مسائي)">المرحلة الثالثة (مسائي)</option>
                <option value="المرحلة الثانية (صباحي)">المرحلة الثانية (صباحي)</option>
                <option value="المرحلة الأولى (صباحي)">المرحلة الأولى (صباحي)</option>
                <option value="دراسات عليا">دراسات عليا</option>
              </select>
            </div>

            <button
              onClick={handleOpenNewCodeModal}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ إصدار كود جديد لطالب</span>
            </button>
          </div>

          {/* Student Codes Table / Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {filteredCodes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm space-y-2">
                <KeyRound className="w-10 h-10 text-slate-600 mx-auto" />
                <p>لا توجد أكواد مطابقة لنتائج البحث</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">كود الاشتراك</th>
                      <th className="p-4">بيانات الطالب</th>
                      <th className="p-4">المرحلة والكروب</th>
                      <th className="p-4">المواد المصرح بها</th>
                      <th className="p-4">الجهاز المقترن</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredCodes.map((sc) => {
                      const allowedSubs =
                        sc.allowedSubjectIds.length === 0
                          ? subjects
                          : subjects.filter((s) => sc.allowedSubjectIds.includes(s.id));

                      return (
                        <tr key={sc.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* Code Pill */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm bg-blue-950/80 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-xl select-all">
                                {sc.code}
                              </span>
                              <button
                                onClick={() => handleCopyCode(sc.code, sc.id)}
                                title="نسخ الكود"
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                {copiedCodeId === sc.id ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {sc.notes && (
                              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] truncate">
                                📝 {sc.notes}
                              </p>
                            )}
                          </td>

                          {/* Student Details */}
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-white text-sm">
                                {sc.studentName}
                              </h4>
                              {sc.school && (
                                <p className="text-[11px] text-slate-400">
                                  🏫 {sc.school}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Grade & Group */}
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="font-medium text-slate-300 block">{sc.grade}</span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold text-[11px]">
                                👥 {sc.group || (sc.city ? `جروب ${sc.city}` : 'جروب A')}
                              </span>
                            </div>
                          </td>

                          {/* Allowed Subjects */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {allowedSubs.map((sub) => (
                                <span
                                  key={sub.id}
                                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                                >
                                  {sub.title.split('-')[0]}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Bound Device & Reset Option */}
                          <td className="p-4">
                            {sc.boundDeviceId ? (
                              <div className="space-y-1.5 max-w-[160px]">
                                <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-xl">
                                  <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  <span className="font-bold truncate text-[11px]">
                                    {sc.boundDeviceName || 'جهاز مقترن'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleResetDevice(sc.id, sc.studentName)}
                                  title="إلغاء ربط الجهاز للسماح للطالب بالدخول من جهاز جديد"
                                  className="w-full flex items-center justify-center gap-1 py-1 px-2 text-[10px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>ترسيت الجهاز</span>
                                </button>
                              </div>
                            ) : (
                              <span className="px-2.5 py-1 text-[11px] text-slate-400 bg-slate-800/80 border border-slate-700/60 rounded-xl flex items-center gap-1 w-fit">
                                <Smartphone className="w-3 h-3 text-slate-500" />
                                <span>جاهز للتفعيل</span>
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleCodeStatus(sc.id)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 ${
                                sc.status === 'active'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              {sc.status === 'active' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>نشط</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  <span>معطل</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              
                              {/* Copy Full Credentials / Share Button */}
                              <button
                                onClick={() => {
                                  const text = `🎓 منصة قسم هندسة تكرير النفط والغاز\n👤 الطالب: ${sc.studentName}\n👥 الكروب: ${sc.group || 'جروب A'}\n🔑 كود التفعيل: ${sc.code}\n🌐 رابط الدخول: ${typeof window !== 'undefined' ? window.location.origin : ''}`;
                                  navigator.clipboard.writeText(text);
                                  alert(`تم نسخ رسالة التفعيل للطالب (${sc.studentName}) بنجاح!`);
                                }}
                                title="نسخ رسالة التفعيل المجهزة لإرسالها للطالب"
                                className="p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition-all border border-emerald-500/30 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditCode(sc)}
                                title="تعديل بيانات الطالب والكود"
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteCode(sc.id)}
                                title="حذف الكود"
                                className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl transition-colors border border-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: COURSES, SECTIONS & LECTURES UPLOADER                   */}
      {/* ============================================================== */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Subjects Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white">المواد الدراسية</h3>
                <button
                  onClick={() => setIsNewSubjectModalOpen(true)}
                  className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>مادة جديدة</span>
                </button>
              </div>

              <div className="space-y-2">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                      sub.id === currentSubject?.id
                        ? 'bg-blue-600/20 border-blue-500/50 text-white font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-lg">{sub.icon}</span>
                      <div className="truncate">
                        <p className="text-xs truncate">{sub.title}</p>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {sub.sections.length} فصول
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters & Lectures for selected Subject */}
          <div className="lg:col-span-3 space-y-6">
            {currentSubject ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                
                {/* Subject Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                      {currentSubject.icon}
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-white">
                        {currentSubject.title}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {currentSubject.gradeLevel} • {currentSubject.sections.length} فصول
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsNewSectionModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة فصل / قسم جديد</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(currentSubject.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="حذف المادة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sections List */}
                <div className="space-y-6">
                  {currentSubject.sections.length === 0 ? (
                    <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-3">
                      <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">لا توجد فصول مضافة لهذه المادة بعد</p>
                      <button
                        onClick={() => setIsNewSectionModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                      >
                        + أضف الفصل الأول الآن
                      </button>
                    </div>
                  ) : (
                    currentSubject.sections.map((section, sIdx) => (
                      <div
                        key={section.id}
                        className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-white">
                                {section.title}
                              </h3>
                              {section.description && (
                                <p className="text-[11px] text-slate-400">{section.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenNewLectureModal(section.id)}
                              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-emerald-500/30"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>+ رفع / إضافة محاضرة</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                              title="حذف الفصل"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Section Lectures */}
                        <div className="space-y-2 mr-2">
                          {section.lectures.length === 0 ? (
                            <div className="p-3 text-center text-[11px] text-slate-500 bg-slate-900/50 rounded-xl">
                              لا توجد محاضرات في هذا الفصل. اضغط على "+ رفع / إضافة محاضرة" لإضافة أول درس.
                            </div>
                          ) : (
                            section.lectures.map((lec, lIdx) => (
                              <div
                                key={lec.id}
                                className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                                    <PlaySquare className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-xs font-bold text-white truncate">
                                        {lec.title}
                                      </h5>
                                      {lec.isFreePreview && (
                                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                                          مجانية
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono truncate">
                                      {lec.videoUrl} • {lec.durationMinutes} دقيقة • {lec.attachments.length} ملزمة
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleDeleteLecture(section.id, lec.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                                    title="حذف المحاضرة"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            ) : null}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: Q&A MANAGEMENT                                         */}
      {/* ============================================================== */}
      {activeTab === 'qa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">
                صندوق الرد على استفسارات الطلاب
              </h3>
              <p className="text-xs text-slate-400">
                الردود المكتوبة هنا تظهر فوراً للطالب مع إشعار رسمي من المسؤول
              </p>
            </div>
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-xl font-bold">
              {comments.length} استفسار مسجل
            </span>
          </div>

          <div className="space-y-4">
            {comments.map((com) => (
              <div
                key={com.id}
                className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{com.studentName}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                      كود: {com.studentCode}
                    </span>
                    {com.studentGrade && (
                      <span className="text-xs text-slate-400">({com.studentGrade})</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatArabicDate(com.createdAt)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {com.text}
                </p>

                {/* Existing replies */}
                {com.replies && com.replies.length > 0 && (
                  <div className="space-y-2 pr-4 border-r-2 border-amber-500/40">
                    {com.replies.map((r) => (
                      <div
                        key={r.id}
                        className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs space-y-1"
                      >
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {r.authorName}
                        </span>
                        <p className="text-slate-200">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Form */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={qaReplies[com.id] || ''}
                    onChange={(e) =>
                      setQaReplies({ ...qaReplies, [com.id]: e.target.value })
                    }
                    placeholder="اكتب رد المسؤول الرسمي هنا..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleTeacherReply(com.id)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال الرد</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: OVERVIEW & STATS                                        */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-bold block">إجمالي الطلاب</span>
              <p className="text-2xl font-black text-white">{studentCodes.length}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-bold block">الأكواد النشطة</span>
              <p className="text-2xl font-black text-white">
                {studentCodes.filter((c) => c.status === 'active').length}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-bold block">المواد الدراسية</span>
              <p className="text-2xl font-black text-white">{subjects.length}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <PlaySquare className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 font-bold block">إجمالي المحاضرات</span>
              <p className="text-2xl font-black text-white">{totalLecturesCount}</p>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: SETTINGS & TEACHER PROFILE                              */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-extrabold text-white">
              الملف التعريفي للمسؤول وضبط المنصة
            </h3>
            <button
              onClick={() => {
                if (confirm('هل تريد إعادة تعيين البيانات إلى الحالة الافتراضية؟')) {
                  onResetData();
                }
              }}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط المصنع</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">اسم المسؤول</label>
              <input
                type="text"
                value={teacherProfile.name}
                onChange={(e) =>
                  onUpdateTeacherProfile({ ...teacherProfile, name: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الصفة والتخصص</label>
              <input
                type="text"
                value={teacherProfile.title}
                onChange={(e) =>
                  onUpdateTeacherProfile({ ...teacherProfile, title: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب</label>
              <input
                type="text"
                value={teacherProfile.phone}
                onChange={(e) =>
                  onUpdateTeacherProfile({ ...teacherProfile, phone: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">رمز PIN السري للوحة التحكم</label>
              <input
                type="text"
                value={teacherProfile.adminPin}
                onChange={(e) =>
                  onUpdateTeacherProfile({ ...teacherProfile, adminPin: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-amber-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT STUDENT CODE                                 */}
      {/* ============================================================== */}
      {isNewCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-extrabold text-base">
                  {editingCodeId ? 'تعديل كود وبيانات الطالب' : 'إصدار كود جديد لطالب'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewCodeModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCode} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم الطالب الرباعي / الكامل <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="مثال: علي حسن كاظم الساعدي"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المرحلة الدراسية
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
                  >
                    <option value="المرحلة الرابعة (صباحي)">المرحلة الرابعة (صباحي)</option>
                    <option value="المرحلة الرابعة (مسائي)">المرحلة الرابعة (مسائي)</option>
                    <option value="المرحلة الثالثة (صباحي)">المرحلة الثالثة (صباحي)</option>
                    <option value="المرحلة الثالثة (مسائي)">المرحلة الثالثة (مسائي)</option>
                    <option value="المرحلة الثانية (صباحي)">المرحلة الثانية (صباحي)</option>
                    <option value="المرحلة الثانية (مسائي)">المرحلة الثانية (مسائي)</option>
                    <option value="المرحلة الأولى (صباحي)">المرحلة الأولى (صباحي)</option>
                    <option value="المرحلة الأولى (مسائي)">المرحلة الأولى (مسائي)</option>
                    <option value="دراسات عليا">دراسات عليا (ماجستير / دبلوم)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    كروب الطالب (Group)
                  </label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-amber-300 font-bold focus:outline-none"
                  >
                    <option value="جروب A (Group A)">جروب A (Group A)</option>
                    <option value="جروب B (Group B)">جروب B (Group B)</option>
                    <option value="جروب C (Group C)">جروب C (Group C)</option>
                    <option value="جروب D (Group D)">جروب D (Group D)</option>
                    <option value="شعبة A">شعبة A</option>
                    <option value="شعبة B">شعبة B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  القسم / القاعة (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder="قسم هندسة تكرير النفط والغاز - قاعة 14"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Code input with Auto-generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    كود الدخول المخصص <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, customCode: generateStudentCode('PETRO', 'ENG') })
                    }
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                  >
                    توليد كود عشوائي جديد 🎲
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value.toUpperCase() })}
                  placeholder="PETRO-XXXX-ENG-2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-center text-base font-mono font-bold text-amber-400 tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Allowed Subjects Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  المواد المسموح له بمشاهدتها:
                </label>
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {subjects.map((sub) => {
                    const isChecked = formData.allowedSubjectIds.includes(sub.id);
                    return (
                      <label key={sub.id} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                allowedSubjectIds: [...formData.allowedSubjectIds, sub.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                allowedSubjectIds: formData.allowedSubjectIds.filter(
                                  (id) => id !== sub.id
                                ),
                              });
                            }
                          }}
                          className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-200">{sub.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Device Binding Status & In-Modal Reset (if editing) */}
              {editingCodeId && (() => {
                const editingCode = studentCodes.find((c) => c.id === editingCodeId);
                if (!editingCode) return null;
                return (
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      حالة قفل الجهاز (Device Lock):
                    </label>
                    {editingCode.boundDeviceId ? (
                      <div className="flex items-center justify-between gap-3 bg-blue-950/40 border border-blue-500/30 p-2.5 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-blue-300">
                          <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                          <div>
                            <p className="font-bold">{editingCode.boundDeviceName || 'جهاز مقترن'}</p>
                            <p className="text-[10px] text-slate-400">الكود مقفل على هذا الجهاز فقط</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleResetDevice(editingCode.id, editingCode.studentName);
                            setIsNewCodeModalOpen(false);
                          }}
                          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>ترسيت الجهاز الآن</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>الكود غير مقترن بأي جهاز حالياً (سيقفل تلقائياً على أول جهاز يسجل به الطالب).</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات إضافية (خاصة بالمسؤول)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="مثال: تم سداد الاشتراك كاش، طالب مسائي..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCodeModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25"
                >
                  حفظ وتأكيد الكود
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW SUBJECT                                         */}
      {/* ============================================================== */}
      {isNewSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white">إضافة مادة دراسية جديدة</h3>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المادة</label>
                <input
                  type="text"
                  required
                  value={subjectForm.title}
                  onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })}
                  placeholder="مثال: الكيمياء - السادس العلمي"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المرحلة</label>
                  <input
                    type="text"
                    value={subjectForm.gradeLevel}
                    onChange={(e) => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الأيقونة (إيموجي)</label>
                  <input
                    type="text"
                    value={subjectForm.icon}
                    onChange={(e) => setSubjectForm({ ...subjectForm, icon: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">وصف المادة</label>
                <textarea
                  rows={2}
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="نبذة عن المنهج..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSubjectModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  إنشاء المادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW SECTION (CHAPTER)                               */}
      {/* ============================================================== */}
      {isNewSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-white">إضافة فصل / قسم جديد</h3>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الكورس الدراسي <span className="text-rose-400">*</span>
                </label>
                <select
                  value={sectionForm.semester}
                  onChange={(e) =>
                    setSectionForm({
                      ...sectionForm,
                      semester: e.target.value as 'first' | 'second',
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-amber-400 font-bold focus:outline-none"
                >
                  <option value="first">📚 الكورس الأول (Semester 1)</option>
                  <option value="second">📖 الكورس الثاني (Semester 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الفصل / الباب</label>
                <input
                  type="text"
                  required
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                  placeholder="مثال: الفصل الأول - موازنة المادة والطاقة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">وصف اختياري</label>
                <input
                  type="text"
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  placeholder="ملاحظات حول موضوع الفصل..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSectionModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  إضافة الفصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / UPLOAD LECTURE                                    */}
      {/* ============================================================== */}
      {isNewLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <h3 className="font-extrabold text-base">رفع / إضافة محاضرة جديدة</h3>
              </div>
              <button
                onClick={() => setIsNewLectureModalOpen(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLecture} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان المحاضرة <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  placeholder="مثال: المحاضرة 4 - قاعدة لوبيتال والمعدلات المرتبطة بالزمن"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-300">
                    مصدر الفيديو <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        videoSourceType === 'upload'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>رفع من جهازي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        videoSourceType === 'url'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>رابط (YouTube / رابط مباشر)</span>
                    </button>
                  </div>
                </div>

                {videoSourceType === 'upload' ? (
                  <div className="bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center transition-all">
                    {isVideoUploading ? (
                      <div className="py-4 space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-xs font-bold text-emerald-300">جاري رفع وحفظ الفيديو على السيرفر...</p>
                        <p className="text-[10px] text-slate-400">يرجى الانتظار حتى اكتمال المعالجة</p>
                      </div>
                    ) : uploadedVideoInfo ? (
                      <div className="py-2 space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تم رفع الفيديو بنجاح!</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <Film className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate font-mono text-white text-[11px]">{uploadedVideoInfo.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">{uploadedVideoInfo.size}</span>
                        </div>
                        <label className="inline-block text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer mt-1">
                          اختر فيديو آخر للتغيير
                          <input
                            type="file"
                            accept="video/*,.mp4,.mov,.mkv,.webm"
                            onChange={handleVideoFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="block py-4 cursor-pointer group">
                        <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
                        <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          اضغط هنا لاختيار فيديو المحاضرة من جهازك (MP4 / MOV / WebM)
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          سيتم حفظ وتشغيل الفيديو من جهازك مباشرة على المنصة
                        </p>
                        <input
                          type="file"
                          accept="video/*,.mp4,.mov,.mkv,.webm"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    required={videoSourceType === 'url'}
                    value={lectureForm.videoUrl}
                    onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono text-left"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    مدة المحاضرة (بالدقائق)
                  </label>
                  <input
                    type="number"
                    value={lectureForm.durationMinutes}
                    onChange={(e) =>
                      setLectureForm({ ...lectureForm, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lectureForm.isFreePreview}
                      onChange={(e) =>
                        setLectureForm({ ...lectureForm, isFreePreview: e.target.checked })
                      }
                      className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span>محاضرة مجانية تجريبية</span>
                  </label>
                </div>
              </div>

              {/* Optional PDF Attachment */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    ملزمة أو شيت PDF للدرس (اختياري)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPdfSourceType('upload')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        pdfSourceType === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      رفع PDF من جهازي
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfSourceType('url')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        pdfSourceType === 'url' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      رابط Drive
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={lectureForm.pdfTitle}
                  onChange={(e) => setLectureForm({ ...lectureForm, pdfTitle: e.target.value })}
                  placeholder="عنوان الملزمة (مثال: ملزمة المحاضرة والشيتات PDF)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />

                {pdfSourceType === 'upload' ? (
                  <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-3 text-center">
                    {isPdfUploading ? (
                      <div className="flex items-center justify-center gap-2 py-1 text-xs text-emerald-400 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري رفع ملف PDF...</span>
                      </div>
                    ) : uploadedPdfInfo ? (
                      <div className="flex items-center justify-between text-xs text-emerald-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-white text-[11px] truncate">{uploadedPdfInfo.name}</span>
                        </div>
                        <label className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer shrink-0">
                          تغيير
                          <input type="file" accept=".pdf,application/pdf" onChange={handlePdfFileUpload} className="hidden" />
                        </label>
                      </div>
                    ) : (
                      <label className="block py-1 cursor-pointer text-xs text-slate-300 hover:text-emerald-300 transition-colors">
                        <FileText className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                        <span>اضغط لاختيار ملف PDF من جهازك</span>
                        <input type="file" accept=".pdf,application/pdf" onChange={handlePdfFileUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={lectureForm.pdfUrl}
                    onChange={(e) => setLectureForm({ ...lectureForm, pdfUrl: e.target.value })}
                    placeholder="رابط ملف PDF (Google Drive أو رابط مباشر)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono text-left"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLectureModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-slate-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25"
                >
                  رفع ونشر المحاضرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
