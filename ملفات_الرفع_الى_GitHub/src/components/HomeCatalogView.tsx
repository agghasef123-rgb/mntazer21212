'use client';

import React, { useState } from 'react';
import { Subject, StudentCode, TeacherProfile } from '@/types';
import { 
  Search, 
  BookOpen, 
  KeyRound, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Play, 
  Layers, 
  Clock, 
  Phone, 
  GraduationCap, 
  ShieldCheck,
  FileText,
  UserCheck,
  School,
  MapPin,
  ArrowLeft
} from 'lucide-react';

interface HomeCatalogViewProps {
  subjects: Subject[];
  currentStudent: StudentCode | null;
  teacherProfile: TeacherProfile;
  isAdmin: boolean;
  onSelectSubject: (subject: Subject) => void;
  onOpenStudentLogin: () => void;
  onOpenAdminAuth: () => void;
}

export default function HomeCatalogView({
  subjects,
  currentStudent,
  teacherProfile,
  isAdmin,
  onSelectSubject,
  onOpenStudentLogin,
  onOpenAdminAuth,
}: HomeCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || s.gradeLevel === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const totalLecturesCount = subjects.reduce(
    (acc, s) => acc + s.sections.reduce((lAcc, sec) => lAcc + sec.lectures.length, 0),
    0
  );

  return (
    <div className="space-y-10 pb-16" dir="rtl">
      
      {/* ============================================================== */}
      {/* HERO SECTION                                                  */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-in fade-in zoom-in duration-300">
            <span className="text-sm">🛢️</span>
            <span>المنصة التعليمية لقسم هندسة تكرير النفط والغاز</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            بوابة المحاضرات الهندسية <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">لتكرير النفط والغاز</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            محاضرات فيديو تخصصية، شيتات وملازم التصميم الهندسي، ومسائل الامتحانات لجميع مواد ومختبرات القسم.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {currentStudent ? (
              <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/10">
                <UserCheck className="w-5 h-5" />
                <span>أهلاً بك {currentStudent.studentName}، يمكنك تصفح موادك ومحاضراتك الآن</span>
              </div>
            ) : (
              <button
                onClick={onOpenStudentLogin}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-extrabold flex items-center gap-2.5 shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <KeyRound className="w-5 h-5" />
                <span>تسجيل الدخول بكود الطالب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => (window.location.hash = 'admin')}
                className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة تحكم الأستاذ (رفع المحاضرات والأكواد)</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* ACTIVE STUDENT PROFILE CARD BANNER                             */}
      {/* ============================================================== */}
      {currentStudent && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold text-lg">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white">
                    بطاقة الطالب: {currentStudent.studentName}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md font-bold">
                    حساب نشط
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>🎓 {currentStudent.grade}</span>
                  {currentStudent.city && <span>• 📍 {currentStudent.city}</span>}
                  {currentStudent.school && <span>• 🏫 {currentStudent.school}</span>}
                  <span className="font-mono text-blue-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    كود: {currentStudent.code}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-600/20 text-blue-300 px-3 py-1.5 rounded-xl font-bold border border-blue-500/30">
                المواد المتاحة: {
                  currentStudent.allowedSubjectIds.length === 0
                    ? 'كافة المواد'
                    : `${currentStudent.allowedSubjectIds.length} مادة`
                }
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* COURSES & SUBJECTS CATALOG                                     */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span>المواد الدراسية والمناهج المتاحة</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              اختر المادة لتصفح الفصول ومشاهدة المحاضرات وتحميل الملازم
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مادة..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-9 pl-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const hasAccess =
              isAdmin ||
              (currentStudent &&
                (currentStudent.allowedSubjectIds.length === 0 ||
                  currentStudent.allowedSubjectIds.includes(subject.id)));

            const subjectLecturesCount = subject.sections.reduce(
              (acc, s) => acc + s.lectures.length,
              0
            );

            return (
              <div
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Background gradient hint */}
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 group-hover:h-2 transition-all" />

                <div className="space-y-4">
                  
                  {/* Top Badges */}
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">
                      {subject.icon}
                    </span>
                    {hasAccess ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        مفتوح لك
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded-xl flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        كود تفعيل
                      </span>
                    )}
                  </div>

                  {/* Title & Stage */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {subject.gradeLevel}
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                      {subject.title}
                    </h3>
                  </div>

                </div>

                {/* Card Footer */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      {subject.sections.length} فصول
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 text-blue-400" />
                      {subjectLecturesCount} محاضرة
                    </span>
                  </div>

                  <span className="font-bold text-blue-400 group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>عرض المنهج</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================== */}
      {/* HOW IT WORKS / CODE SYSTEM EXPLANATION                         */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6">
          <h3 className="text-lg sm:text-xl font-black text-white">
            كيف تنضم وتبدأ بمشاهدة المحاضرات؟
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                1
              </div>
              <h4 className="font-bold text-sm text-white">استلم كود اشتراكك</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                يقوم الأستاذ بإصدار كود مخصص لك يحتوي على اسمك ومرحلتك والمواد المصرحة.
              </p>
            </div>

            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                2
              </div>
              <h4 className="font-bold text-sm text-white">أدخل الكود في المنصة</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                اضغط على زر &quot;دخول بكود الطالب&quot; وستظهر لك فوراً بياناتك المسجلة وكافة محاضراتك.
              </p>
            </div>

            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                3
              </div>
              <h4 className="font-bold text-sm text-white">شاهد وحمّل الملازم</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                شاهد الفيديوهات بجودة عالية، حمّل ملفات PDF، واطرح أسئلتك مباشرة للأستاذ.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
