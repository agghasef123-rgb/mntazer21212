'use client';

import React, { useState, useEffect } from 'react';
import { StudentCode, Subject } from '@/types';
import { getOrCreateDeviceId, getFriendlyDeviceName } from '@/lib/device';
import { 
  KeyRound, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  MapPin, 
  Phone, 
  GraduationCap, 
  X, 
  Sparkles,
  ArrowLeft,
  School,
  Smartphone,
  ShieldAlert,
  Lock,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCodes: StudentCode[];
  subjects: Subject[];
  onSuccessLogin: (student: StudentCode) => void;
}

export default function StudentLoginModal({
  isOpen,
  onClose,
  availableCodes,
  subjects,
  onSuccessLogin,
}: StudentLoginModalProps) {
  const [codeInput, setCodeInput] = useState('');
  const [matchedStudent, setMatchedStudent] = useState<StudentCode | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDeviceConflict, setIsDeviceConflict] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<{ deviceName?: string; boundAt?: string } | null>(null);

  const currentDeviceId = typeof window !== 'undefined' ? getOrCreateDeviceId() : '';

  useEffect(() => {
    if (!isOpen) {
      setCodeInput('');
      setMatchedStudent(null);
      setErrorMsg('');
      setIsDeviceConflict(false);
      setConflictDetails(null);
    }
  }, [isOpen]);

  // Real-time lookup
  const handleCodeChange = (val: string) => {
    const formatted = val.toUpperCase().trim();
    setCodeInput(formatted);
    setErrorMsg('');
    setIsDeviceConflict(false);
    setConflictDetails(null);

    if (formatted.length >= 4) {
      const found = availableCodes.find(
        (c) => c.code.toUpperCase().replace(/\s/g, '') === formatted.replace(/\s/g, '')
      );
      if (found) {
        if (found.status === 'disabled') {
          setErrorMsg('هذا الكود معطل من قبل المسؤول. يرجى التواصل مع المسؤول لتفعيله.');
          setMatchedStudent(null);
        } else if (found.status === 'expired') {
          setErrorMsg('انتهت صلاحية هذا الكود. يرجى التواصل مع المسؤول للتجديد.');
          setMatchedStudent(null);
        } else if (found.boundDeviceId && found.boundDeviceId !== currentDeviceId) {
          // Bound to a different device!
          setIsDeviceConflict(true);
          setConflictDetails({
            deviceName: found.boundDeviceName || 'جهاز آخر',
            boundAt: found.boundAt || '',
          });
          setErrorMsg(
            `هذا الكود مقترن ومثبت على جهاز آخر (${found.boundDeviceName || 'جهاز سابق'}). لمنع تداول الأكواد، الكود يعمل على جهاز واحد فقط.`
          );
          setMatchedStudent(null);
        } else {
          setMatchedStudent(found);
          setErrorMsg('');
          setIsDeviceConflict(false);
        }
      } else {
        setMatchedStudent(null);
      }
    } else {
      setMatchedStudent(null);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      setErrorMsg('يرجى كتابة كود الاشتراك الممنوح لك');
      return;
    }

    const found = availableCodes.find(
      (c) => c.code.toUpperCase().replace(/\s/g, '') === codeInput.toUpperCase().replace(/\s/g, '')
    );

    if (!found) {
      setErrorMsg('كود الدخول غير صحيح! تأكد من كتابة الكود بدقة كما وصلك.');
      return;
    }

    if (found.status !== 'active') {
      setErrorMsg(
        found.status === 'disabled'
          ? 'هذا الكود غير نشط حالياً، تواصل مع المسؤول للتفعيل.'
          : 'انتهت صلاحية الكود.'
      );
      return;
    }

    // Device check
    if (found.boundDeviceId && found.boundDeviceId !== currentDeviceId) {
      setIsDeviceConflict(true);
      setConflictDetails({
        deviceName: found.boundDeviceName || 'جهاز آخر',
        boundAt: found.boundAt || '',
      });
      setErrorMsg(
        `هذا الكود مقترن بجهاز آخر (${found.boundDeviceName || 'جهاز سابق'}). يرجى التواصل مع المسؤول لترسيت الكود لجهازك الجديد.`
      );
      return;
    }

    // If first time on this device, bind it!
    const updatedStudent: StudentCode = {
      ...found,
      boundDeviceId: currentDeviceId,
      boundDeviceName: found.boundDeviceName || getFriendlyDeviceName(),
      boundAt: found.boundAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    triggerConfetti();
    onSuccessLogin(updatedStudent);
    onClose();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen) return null;

  // Find names of allowed subjects
  const allowedSubjects = matchedStudent
    ? matchedStudent.allowedSubjectIds.length === 0
      ? subjects
      : subjects.filter((s) => matchedStudent.allowedSubjectIds.includes(s.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">تسجيل الدخول بكود الطالب</h2>
              <p className="text-xs text-blue-100 mt-0.5">
                الكود يُفعل لجهاز واحد فقط لضمان أمان حسابك ومحاضراتك
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رمز / كود الاشتراك
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="مثال: EDU-7890-MATH"
                  className={`w-full bg-slate-950/70 border rounded-2xl px-4 py-3.5 text-center font-mono text-lg font-bold placeholder:text-slate-600 focus:outline-none transition-all tracking-wider ${
                    isDeviceConflict
                      ? 'border-rose-500/80 text-rose-400 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-700 text-blue-400 focus:ring-2 focus:ring-blue-500'
                  }`}
                  autoFocus
                />
                {matchedStudent && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 absolute left-3 top-3.5" />
                )}
                {isDeviceConflict && (
                  <ShieldAlert className="w-6 h-6 text-rose-400 absolute left-3 top-3.5" />
                )}
              </div>
            </div>

            {/* Error Message or Device Conflict Alert */}
            {errorMsg && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-2xl border text-xs leading-relaxed ${
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
                    <p className="text-[11px] text-rose-200/80 bg-rose-900/30 p-2 rounded-xl border border-rose-500/20">
                      💡 <strong>هل قمت بتغيير هاتفك أو مسح المتصفح؟</strong> تواصل مع المسؤول ليقوم بالضغط على خيار &quot;ترسيت جهاز الكود&quot; من لوحة التحكم، وستتمكن من تفعيله على جهازك الجديد فوراً.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* If Student Info is Matched & Allowed on this device */}
            {matchedStudent && (
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-blue-500/40 rounded-2xl p-4.5 space-y-3.5 shadow-lg shadow-blue-500/5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        {matchedStudent.studentName}
                      </h4>
                      <p className="text-xs text-blue-300 font-medium">
                        {matchedStudent.grade}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
                    {matchedStudent.boundDeviceId ? 'جهازك المقترن ✓' : 'تفعيل جديد للجهاز 📱'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {matchedStudent.group && (
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 p-2 rounded-xl">
                      <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{matchedStudent.group}</span>
                    </div>
                  )}
                  {matchedStudent.school && (
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 p-2 rounded-xl">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{matchedStudent.school}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/50 p-2 rounded-xl">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>المواد: {allowedSubjects.length} مادة</span>
                  </div>
                </div>

                {/* Device Protection Notice */}
                {!matchedStudent.boundDeviceId && (
                  <div className="flex items-center gap-2 p-2 bg-blue-950/40 border border-blue-500/30 rounded-xl text-[11px] text-blue-300">
                    <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>سيتم ربط هذا الكود بهذا الجهاز فقط عند الدخول.</span>
                  </div>
                )}

                {/* Allowed Subjects Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    المواد الدراسية المتاحة لك:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {allowedSubjects.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        {sub.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit / Confirm Button */}
            <button
              type="submit"
              disabled={!matchedStudent}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                matchedStudent
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{matchedStudent ? 'تأكيد ودخول المنصة الآن' : 'يرجى كتابة كود صالح للمتابعة'}</span>
              {matchedStudent && <ArrowLeft className="w-4 h-4" />}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
