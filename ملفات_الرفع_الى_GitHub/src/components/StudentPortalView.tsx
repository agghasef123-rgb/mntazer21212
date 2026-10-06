'use client';

import React, { useState } from 'react';
import { Subject, StudentCode } from '@/types';
import { 
  BookOpen, 
  Search, 
  UserCheck, 
  Layers, 
  Play, 
  ArrowLeft, 
  CalendarDays, 
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface StudentPortalViewProps {
  subjects: Subject[];
  currentStudent: StudentCode;
  isAdmin: boolean;
  onSelectSubject: (subject: Subject) => void;
  onStudentLogout: () => void;
}

export default function StudentPortalView({
  subjects,
  currentStudent,
  isAdmin,
  onSelectSubject,
  onStudentLogout,
}: StudentPortalViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'first' | 'second'>('all');

  // Filter subjects by search and student permissions
  const studentAllowedSubjects =
    isAdmin || currentStudent.allowedSubjectIds.length === 0
      ? subjects
      : subjects.filter((s) => currentStudent.allowedSubjectIds.includes(s.id));

  const filteredSubjects = studentAllowedSubjects.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      
      {/* ============================================================== */}
      {/* STUDENT PROFILE HERO BANNER                                    */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-500" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-lg">
            <UserCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                أهلاً بك، {currentStudent.studentName}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                حساب مفعل ✓
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              <span className="font-semibold text-amber-300">
                {currentStudent.grade}
              </span>
              {currentStudent.group && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                    👥 {currentStudent.group}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                كود: {currentStudent.code}
              </span>
              {currentStudent.school && (
                <>
                  <span>•</span>
                  <span>{currentStudent.school}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onStudentLogout}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 text-slate-400 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CONTROLS: SEARCH & SEMESTER TABS                               */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              المواد والمختبرات الدراسية
            </h3>
            <p className="text-xs text-slate-400">
              اختر المادة لتصفح الفصول ومشاهدة المحاضرات وتحميل الشيتات
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مادة..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBJECTS GRID                                                  */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => {
          const subjectLecturesCount = subject.sections.reduce(
            (acc, s) => acc + s.lectures.length,
            0
          );

          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-500 group-hover:h-1.5 transition-all" />

              <div className="space-y-4">
                
                {/* Top icon and access badge */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </span>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                    متاح للمشاهدة ✓
                  </span>
                </div>

                {/* Subject Title & Grade */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {subject.gradeLevel}
                  </span>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    {subject.title}
                  </h4>
                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    {subject.sections.length} فصول
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 text-blue-400" />
                    {subjectLecturesCount} محاضرة
                  </span>
                </div>

                <span className="font-bold text-amber-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  <span>دخول المادة</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
