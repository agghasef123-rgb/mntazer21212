'use client';

import React, { useState } from 'react';
import { StudentCode, Subject } from '@/types';
import { getOrCreateDeviceId, getFriendlyDeviceName } from '@/lib/device';
import { 
  KeyRound, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles,
  Lock,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LandingGatewayViewProps {
  availableCodes: StudentCode[];
  subjects: Subject[];
  onSuccessLogin: (student: StudentCode) => void;
  onOpenAdminAuth: () => void;
}

export default function LandingGatewayView({
  availableCodes,
  subjects,
  onSuccessLogin,
  onOpenAdminAuth,
}: LandingGatewayViewProps) {
  const [codeInput, setCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<StudentCode | null>(null);
  const [isDeviceConflict, setIsDeviceConflict] = useState(false);

  const currentDeviceId = typeof window !== 'undefined' ? getOrCreateDeviceId() : '';

  const handleCodeChange = (val: string) => {
    const formatted = val.toUpperCase().trim();
    setCodeInput(formatted);
    setErrorMsg('');
    setIsDeviceConflict(false);

    if (formatted.length >= 4) {
      const found = availableCodes.find(
        (c) => c.code.toUpperCase().replace(/\s/g, '') === formatted.replace(/\s/g, '')
      );
      if (found) {
        if (found.status === 'disabled') {
          setErrorMsg('هذا الكود معطل من قبل المسؤول.');
          setMatchedStudent(null);
        } else if (found.status === 'expired') {
          setErrorMsg('انتهت صلاحية هذا الكود.');
          setMatchedStudent(null);
        } else if (found.boundDeviceId && found.boundDeviceId !== currentDeviceId) {
          setIsDeviceConflict(true);
          setErrorMsg(
            `هذا الكود مفعّل ومقترن بجهاز آخر (${found.boundDeviceName || 'جهاز سابق'}). الكود مخصص لجهاز واحد فقط.`
          );
          setMatchedStudent(null);
        } else {
          setMatchedStudent(found);
          setErrorMsg('');
        }
      } else {
        setMatchedStudent(null);
      }
    } else {
      setMatchedStudent(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      setErrorMsg('يرجى إدخال كود الدخول الخاص بك');
      return;
    }

    const found = availableCodes.find(
      (c) => c.code.toUpperCase().replace(/\s/g, '') === codeInput.toUpperCase().replace(/\s/g, '')
    );

    if (!found) {
      setErrorMsg('كود الدخول غير صحيح! تأكد من كتابة الكود بدقة.');
      return;
    }

    if (found.status !== 'active') {
      setErrorMsg('هذا الكود غير متاح حالياً.');
      return;
    }

    if (found.boundDeviceId && found.boundDeviceId !== currentDeviceId) {
      setIsDeviceConflict(true);
      setErrorMsg(
        `هذا الكود مقترن بجهاز آخر (${found.boundDeviceName || 'جهاز سابق'}). يرجى طلب ترسيت الكود من الإدارة.`
      );
      return;
    }

    const updatedStudent: StudentCode = {
      ...found,
      boundDeviceId: currentDeviceId,
      boundDeviceName: found.boundDeviceName || getFriendlyDeviceName(),
      boundAt: found.boundAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    onSuccessLogin(updatedStudent);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden" dir="rtl">
      
      {/* Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-amber-600/30 mx-auto border border-amber-400/30">
            <span className="text-3xl">🛢️</span>
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full">
              البوابة التعليمية المغلقة
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              هندسة تكرير النفط والغاز
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              أدخل كود الطالب للدخول إلى منصة المحاضرات والمختبرات
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 text-right">
                رمز / كود الاشتراك الخاص بك:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="مثال: PETRO-2026-ENG"
                  className={`w-full bg-slate-950/80 border rounded-2xl px-4 py-4 text-center font-mono text-xl font-bold placeholder:text-slate-700 focus:outline-none transition-all tracking-widest ${
                    isDeviceConflict
                      ? 'border-rose-500/80 text-rose-400 focus:ring-2 focus:ring-rose-500'
                      : matchedStudent
                      ? 'border-emerald-500/80 text-emerald-400 focus:ring-2 focus:ring-emerald-500'
                      : 'border-slate-700 text-amber-400 focus:ring-2 focus:ring-amber-500'
                  }`}
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-slate-600 absolute right-4 top-4.5" />
                {matchedStudent && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 absolute left-4 top-4.5" />
                )}
              </div>
            </div>

            {/* Error or Alert message */}
            {errorMsg && (
              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                isDeviceConflict
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-medium'
              }`}>
                {isDeviceConflict ? (
                  <Smartphone className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold">{errorMsg}</p>
                  {isDeviceConflict && (
                    <p className="text-[11px] text-rose-200/80">
                      💡 إذا قمت بتغيير هاتفك، يرجى طلب ترسيت الكود من المسؤول.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Matched Student Card Preview */}
            {matchedStudent && (
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-2 text-xs animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {matchedStudent.studentName}
                      </h4>
                      <p className="text-[11px] text-emerald-300">{matchedStudent.grade}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                    كود صالح ومفعل ✓
                  </span>
                </div>
              </div>
            )}

            {/* Action Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-black rounded-2xl shadow-xl shadow-amber-600/25 text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>دخول المنصة وعرض المواد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Single-Device security badge */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>نظام محمي بربط الجهاز لضمان أمان حساب الطالب</span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <button
            onClick={onOpenAdminAuth}
            className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة تحكم الإدارة</span>
          </button>

          <span className="font-mono text-[11px] text-slate-600">
            Dev: Muntadhar Haitham
          </span>
        </div>

      </div>

    </div>
  );
}
