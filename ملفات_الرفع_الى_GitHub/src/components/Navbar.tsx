'use client';

import React, { useState } from 'react';
import { StudentCode, TeacherProfile } from '@/types';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  KeyRound, 
  BookOpen, 
  Menu, 
  X, 
  Lock,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentStudent: StudentCode | null;
  isAdmin: boolean;
  teacherProfile: TeacherProfile;
  activeView: 'home' | 'subject' | 'lecture' | 'admin';
  isCloudConnected?: boolean;
  onNavigateHome: () => void;
  onOpenStudentLogin: () => void;
  onStudentLogout: () => void;
  onOpenAdminAuth: () => void;
  onAdminLogout: () => void;
}

export default function Navbar({
  currentStudent,
  isAdmin,
  teacherProfile,
  activeView,
  isCloudConnected = false,
  onNavigateHome,
  onOpenStudentLogin,
  onStudentLogout,
  onOpenAdminAuth,
  onAdminLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-blue-600 flex items-center justify-center shadow-lg shadow-amber-600/25 group-hover:scale-105 transition-transform">
              <span className="text-xl">🛢️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  هندسة تكرير النفط والغاز
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>سحابي مباشر</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                منصة رفع ومشاهدة المحاضرات التخصصية والشيتات
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Home Navigation */}
            <button
              onClick={onNavigateHome}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeView === 'home' 
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>المواد والمحاضرات</span>
            </button>

            {/* Student Session Badge or Login Button */}
            {currentStudent ? (
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 px-3.5 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{currentStudent.studentName}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      مفعل
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{currentStudent.grade}</span>
                    <span>•</span>
                    <span className="font-mono text-blue-300 text-[10px]">{currentStudent.code}</span>
                  </div>
                </div>
                <button
                  onClick={onStudentLogout}
                  title="تسجيل الخروج أو تبديل الكود"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mr-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenStudentLogin}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <KeyRound className="w-4 h-4" />
                <span>دخول بكود الطالب</span>
              </button>
            )}

            {/* Admin Dashboard Button */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Navigate to admin
                    if (activeView !== 'admin') {
                      window.location.hash = 'admin';
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeView === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-800/80 text-amber-400 border-slate-700 hover:bg-amber-500/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>لوحة التحكم</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="خروج من لوحة التحكم"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-colors border border-transparent hover:border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>دخول المسؤول</span>
              </button>
            )}

          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {!currentStudent && (
              <button
                onClick={onOpenStudentLogin}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>كود الطالب</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {currentStudent ? (
            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl mb-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>{currentStudent.studentName}</span>
                </div>
                <button
                  onClick={() => {
                    onStudentLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  خروج
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{currentStudent.grade} • كود: {currentStudent.code}</p>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenStudentLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول بكود الطالب</span>
            </button>
          )}

          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-right py-2 px-3 text-slate-200 hover:bg-slate-800 rounded-lg text-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>المواد والمحاضرات</span>
          </button>

          {isAdmin ? (
            <button
              onClick={() => {
                window.location.hash = 'admin';
                setMobileMenuOpen(false);
              }}
              className="w-full text-right py-2 px-3 text-amber-300 bg-amber-500/10 rounded-lg text-sm flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>لوحة تحكم المسؤول</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAdminAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full text-right py-2 px-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>تسجيل دخول المسؤول</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
