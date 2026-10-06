'use client';

import React, { useState } from 'react';
import { Subject, Section, Lecture, StudentCode } from '@/types';
import { 
  Play, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Clock, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  User, 
  GraduationCap, 
  Sparkles,
  Layers,
  CalendarDays,
  Plus
} from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  currentStudent: StudentCode | null;
  isAdmin: boolean;
  onSelectLecture: (sec: Section, lec: Lecture) => void;
  onBack: () => void;
  onOpenStudentLogin: () => void;
}

export default function SubjectDetailView({
  subject,
  currentStudent,
  isAdmin,
  onSelectLecture,
  onBack,
  onOpenStudentLogin,
}: SubjectDetailViewProps) {
  // Check if student has access
  const hasAccess =
    isAdmin ||
    (currentStudent &&
      (currentStudent.allowedSubjectIds.length === 0 ||
        currentStudent.allowedSubjectIds.includes(subject.id)));

  // Semester toggle state: 'first' (الكورس الأول) | 'second' (الكورس الثاني) | 'all' (الكل)
  const [selectedSemester, setSelectedSemester] = useState<'first' | 'second' | 'all'>('first');

  // Accordion open states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    subject.sections.reduce((acc, s, idx) => ({ ...acc, [s.id]: true }), {})
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter sections by semester
  const filteredSections = subject.sections.filter((s) => {
    if (selectedSemester === 'all') return true;
    if (!s.semester) return true; // default visible in all
    return s.semester === selectedSemester;
  });

  const totalLectures = subject.sections.reduce((acc, s) => acc + s.lectures.length, 0);
  const totalDuration = subject.sections.reduce(
    (acc, s) => acc + s.lectures.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
      >
        <ArrowRight className="w-4 h-4 text-amber-400" />
        <span>العودة إلى كافة المواد</span>
      </button>

      {/* Hero Header for Subject */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl p-2 bg-slate-800/80 rounded-2xl border border-slate-700">
                {subject.icon}
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
                {subject.gradeLevel}
              </span>
              {hasAccess ? (
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  مادة مفعلة ومتاحة لك
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  مطلوب كود تفعيل
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {subject.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>{subject.sections.length} فصول وأقسام</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-xl">
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>{totalLectures} محاضرة</span>
              </span>
            </div>
          </div>

          {/* Action Callout */}
          {!hasAccess && (
            <div className="w-full md:w-auto shrink-0 bg-gradient-to-br from-blue-950/80 to-indigo-950/80 border border-blue-500/30 p-5 rounded-2xl text-center space-y-3">
              <p className="text-xs font-bold text-blue-200">
                هل لديك كود الاشتراك لهذه المادة؟
              </p>
              <button
                onClick={onOpenStudentLogin}
                className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
              >
                تفعيل كود المادة الآن
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ============================================================== */}
      {/* SEMESTER TABS (نظام الكورسات: الكورس الأول / الكورس الثاني)    */}
      {/* ============================================================== */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-md">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400 ml-1" />
            <span className="text-xs sm:text-sm font-black text-white">
              اختر الكورس الدراسي:
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedSemester('first')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
                selectedSemester === 'first'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              📚 محاضرات الكورس الأول
            </button>

            <button
              onClick={() => setSelectedSemester('second')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
                selectedSemester === 'second'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              📖 محاضرات الكورس الثاني
            </button>

            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedSemester === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              الكل
            </button>
          </div>
        </div>

        {/* Chapters & Lectures Sections */}
        <div className="space-y-4">
          {filteredSections.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-lg">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                لا توجد محاضرات مرفوعة في{' '}
                {selectedSemester === 'first'
                  ? 'الكورس الأول'
                  : selectedSemester === 'second'
                  ? 'الكورس الثاني'
                  : 'هذه المادة'}{' '}
                حتى الآن
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                يمكن للأستاذ رفع محاضرات وفصول جديدة لهذا الكورس من خلال لوحة التحكم في أي وقت.
              </p>
            </div>
          ) : (
            filteredSections.map((section, sIndex) => {
              const isOpen = openSections[section.id];
              return (
                <div
                  key={section.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden transition-all shadow-md"
                >
                  {/* Section Header Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20">
                        {sIndex + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {section.title}
                          </h3>
                          {section.semester && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                              {section.semester === 'first' ? 'الكورس الأول' : 'الكورس الثاني'}
                            </span>
                          )}
                        </div>
                        {section.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                        {section.lectures.length} محاضرات
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Section Lectures List */}
                  {isOpen && (
                    <div className="p-4 sm:p-6 pt-0 border-t border-slate-800/60 divide-y divide-slate-800/60">
                      {section.lectures.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          لا توجد محاضرات مضافة في هذا الفصل بعد.
                        </div>
                      ) : (
                        section.lectures.map((lecture) => {
                          const canWatch = hasAccess || lecture.isFreePreview;

                          return (
                            <div
                              key={lecture.id}
                              className="py-3.5 first:pt-4 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                                  canWatch
                                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 group-hover:bg-amber-600 group-hover:text-white transition-all'
                                    : 'bg-slate-800 text-slate-500'
                                }`}>
                                  {canWatch ? <Play className="w-4 h-4 ml-0.5" /> : <Lock className="w-4 h-4" />}
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                      {lecture.title}
                                    </h4>
                                    {lecture.isFreePreview && (
                                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                                        معاينة مجانية
                                      </span>
                                    )}
                                  </div>
                                  
                                  {lecture.description && (
                                    <p className="text-xs text-slate-400 line-clamp-1">
                                      {lecture.description}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      {lecture.durationMinutes} دقيقة
                                    </span>
                                    {lecture.attachments && lecture.attachments.length > 0 && (
                                      <span className="flex items-center gap-1 text-emerald-400">
                                        <FileText className="w-3 h-3" />
                                        {lecture.attachments.length} ملزمة / شيت مرفق
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <div className="w-full sm:w-auto flex justify-end">
                                {canWatch ? (
                                  <button
                                    onClick={() => onSelectLecture(section, lecture)}
                                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition-all group-hover:scale-105"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>مشاهدة المحاضرة</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={onOpenStudentLogin}
                                    className="w-full sm:w-auto px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>تفعيل الكود للمشاهدة</span>
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
