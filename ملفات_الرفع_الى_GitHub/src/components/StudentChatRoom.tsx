'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, StudentCode } from '@/types';
import { formatArabicDate } from '@/lib/utils';
import { 
  MessageSquare, 
  Send, 
  VolumeX, 
  Volume2, 
  Trash2, 
  ShieldCheck, 
  User, 
  X, 
  Sparkles, 
  AlertCircle,
  Clock,
  ShieldAlert,
  Eraser
} from 'lucide-react';

interface StudentChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentStudent: StudentCode | null;
  isAdmin: boolean;
  onSendMessage: (text: string) => void;
  onDeleteMessage: (id: string) => void;
  onToggleMuteStudent: (studentCode: string) => void;
  onClearChat: () => void;
  allStudents: StudentCode[];
}

export default function StudentChatRoom({
  isOpen,
  onClose,
  messages,
  currentStudent,
  isAdmin,
  onSendMessage,
  onDeleteMessage,
  onToggleMuteStudent,
  onClearChat,
  allStudents,
}: StudentChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if current student is muted
  const isCurrentStudentMuted =
    currentStudent &&
    (currentStudent.isMuted ||
      allStudents.find((s) => s.code === currentStudent.code)?.isMuted);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (isCurrentStudentMuted && !isAdmin) return;

    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="w-full sm:max-w-lg h-full sm:h-[88vh] bg-slate-900 border-0 sm:border border-slate-800 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 relative"
        dir="rtl"
      >
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-5 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">محادثة طلاب القسم</h3>
                <span className="px-2 py-0.2 bg-white/20 rounded-full text-[10px] font-bold">
                  {messages.length} رسالة
                </span>
              </div>
              <p className="text-[11px] text-amber-100">
                المناقشات وتبادل الأسئلة بين طلاب قاعة 14
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm('هل تريد مسح جميع الرسائل في المحادثة؟')) {
                    onClearChat();
                  }
                }}
                title="مسح سجل المحادثة"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <Eraser className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <p className="text-xs font-bold text-slate-400">لا توجد رسائل بعد</p>
              <p className="text-[11px] text-slate-600">كن أول من يبدأ المحادثة ويطرح استفساره!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = currentStudent?.code === msg.senderCode;
              const isMsgFromAdmin = msg.senderRole === 'admin';
              const senderStudent = allStudents.find((s) => s.code === msg.senderCode);
              const isSenderMuted = senderStudent?.isMuted;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMine ? 'items-start' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl space-y-1.5 text-xs shadow-md ${
                      isMsgFromAdmin
                        ? 'bg-gradient-to-r from-amber-950/70 to-orange-950/70 border border-amber-500/40 text-amber-100'
                        : isMine
                        ? 'bg-blue-950/60 border border-blue-500/40 text-slate-100'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-white/10">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isMsgFromAdmin ? (
                          <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                            👑
                          </span>
                        ) : (
                          <div className="w-4 h-4 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">
                            <User className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className={`font-black text-xs ${isMsgFromAdmin ? 'text-amber-300' : 'text-white'}`}>
                          {isMsgFromAdmin ? 'المسؤول' : msg.senderName}
                        </span>
                        {isMsgFromAdmin ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            المسؤول
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            👥 {msg.senderGroup || senderStudent?.group || 'جروب A'}
                          </span>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-400 font-mono shrink-0">
                        {formatArabicDate(msg.createdAt)}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="leading-relaxed whitespace-pre-wrap break-words text-[13px] pt-0.5">
                      {msg.text}
                    </p>

                    {/* Admin Moderation Actions */}
                    {isAdmin && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {!isMsgFromAdmin && (
                          <button
                            onClick={() => onToggleMuteStudent(msg.senderCode)}
                            title={isSenderMuted ? 'إلغاء كتم الطالب' : 'كتم هذا الطالب لمنعه من المراسلة'}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition-colors ${
                              isSenderMuted
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500 hover:text-white'
                            }`}
                          >
                            {isSenderMuted ? (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>إلغاء الكتم</span>
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-3 h-3" />
                                <span>كتم الطالب</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteMessage(msg.id)}
                          title="حذف هذه الرسالة"
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar / Muted Notice */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          {isCurrentStudentMuted && !isAdmin ? (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300">
              <VolumeX className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">تم كتم حسابك من قبل المسؤول</p>
                <p className="text-[10px] text-rose-400/80">لا يمكنك إرسال رسائل في المحادثة حالياً. تواصل مع المسؤول لفك الكتم.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isAdmin
                    ? 'اكتب رسالة أو تنبيهاً لجميع الطلاب...'
                    : `اكتب رسالتك باسم ${currentStudent?.studentName?.split(' ')[0] || 'طالب'}...`
                }
                className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-white rounded-2xl shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
