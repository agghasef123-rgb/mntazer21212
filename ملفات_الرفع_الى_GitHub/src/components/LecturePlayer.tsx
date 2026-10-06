'use client';

import React, { useState } from 'react';
import { Subject, Section, Lecture, StudentCode, Comment, Attachment } from '@/types';
import { getEmbedVideoUrl, formatArabicDate } from '@/lib/utils';
import { 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  Download, 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  User, 
  ShieldCheck, 
  Clock, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Lock,
  Sparkles,
  BookOpen,
  CornerDownLeft
} from 'lucide-react';

interface LecturePlayerProps {
  subject: Subject;
  currentSection: Section;
  currentLecture: Lecture;
  currentStudent: StudentCode | null;
  isAdmin: boolean;
  comments: Comment[];
  onSelectLecture: (sec: Section, lec: Lecture) => void;
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onBackToSubject: () => void;
  onOpenStudentLogin: () => void;
}

export default function LecturePlayer({
  subject,
  currentSection,
  currentLecture,
  currentStudent,
  isAdmin,
  comments,
  onSelectLecture,
  onAddComment,
  onAddReply,
  onBackToSubject,
  onOpenStudentLogin,
}: LecturePlayerProps) {
  const [commentText, setCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const videoMeta = getEmbedVideoUrl(currentLecture.videoUrl);
  const lectureComments = comments.filter((c) => c.lectureId === currentLecture.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentStudent && !isAdmin) {
      onOpenStudentLogin();
      return;
    }
    onAddComment(commentText);
    setCommentText('');
  };

  const handlePostReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;
    onAddReply(commentId, text);
    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" dir="rtl">
      
      {/* Breadcrumb / Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <button 
            onClick={onBackToSubject} 
            className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4" />
            <span>{subject.title}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">
            {currentSection.title}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold truncate max-w-[220px] sm:max-w-none">
            {currentLecture.title}
          </span>
        </div>

        <button
          onClick={onBackToSubject}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium transition-colors flex items-center gap-1"
        >
          <span>قائمة المحاضرات</span>
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column: Video Player & Description & Q&A */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player Box */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative group">
            {videoMeta.type === 'youtube' || videoMeta.type === 'vimeo' || videoMeta.type === 'embed' ? (
              <iframe
                src={videoMeta.embedUrl}
                title={currentLecture.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : currentLecture.videoUrl.startsWith('/uploads/') ||
              currentLecture.videoUrl.match(/\.(mp4|webm|mov|mkv|ogg|m4v)($|\?)/i) ||
              currentLecture.videoUrl.startsWith('blob:') ||
              currentLecture.videoUrl.startsWith('data:') ? (
              <div className="relative w-full h-full">
                <video
                  src={currentLecture.videoUrl}
                  controls
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute top-3 left-3 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>دقة المصدر الأصلية الكاملة (Full HD / 4K)</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                <PlayCircle className="w-16 h-16 text-blue-500 mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-1">{currentLecture.title}</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  رابط المحاضرة: {currentLecture.videoUrl}
                </p>
                <a
                  href={currentLecture.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  فتح المحاضرة في نافذة جديدة ↗
                </a>
              </div>
            )}
          </div>

          {/* Lecture Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
                  {currentSection.title}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {currentLecture.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {currentLecture.durationMinutes} دقيقة
                </span>
                <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {currentLecture.viewsCount + 1} مشاهدة
                </span>
              </div>
            </div>

            {currentLecture.description && (
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                {currentLecture.description}
              </p>
            )}

            {/* Attachments / PDFs */}
            {currentLecture.attachments && currentLecture.attachments.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>الملازم وملفات المحاضرة المرفقة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentLecture.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        if (att.fileUrl === '#') {
                          e.preventDefault();
                          alert(`تم النقر على تحميل ملزمة: ${att.title}`);
                        }
                      }}
                      className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div className="truncate text-right">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                            {att.title}
                          </p>
                          <span className="text-[10px] text-slate-400">{att.size || 'ملف PDF'}</span>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Q&A / Comments Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-extrabold text-white">
                  أسئلة واستفسارات الطلاب حول المحاضرة
                </h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/10 text-blue-400 rounded-lg">
                {lectureComments.length} استفسار
              </span>
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {isAdmin ? <ShieldCheck className="w-5 h-5 text-amber-400" /> : <User className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {isAdmin ? (
                        <strong className="text-amber-400">حساب المسؤول (إجابة رسمية)</strong>
                      ) : currentStudent ? (
                        <span>
                          السؤال باسم: <strong className="text-blue-300">{currentStudent.studentName}</strong> ({currentStudent.group || currentStudent.grade})
                        </span>
                      ) : (
                        <span className="text-amber-400">
                          يرجى تسجيل الدخول بكودك لتتمكن من السؤال
                        </span>
                      )}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      isAdmin
                        ? 'اكتب تعليقاً أو تنبيهاً للطلاب في هذه المحاضرة...'
                        : currentStudent
                        ? 'اطرح سؤالك هنا وسيقوم المسؤول بالرد عليك مباشرة...'
                        : 'سجل دخولك بكود الطالب لتتمكن من طرح الأسئلة'
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                {currentStudent || isAdmin ? (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال السؤال</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenStudentLogin}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    تسجيل الدخول بكود الطالب للكتابة
                  </button>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 pt-2">
              {lectureComments.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  لا توجد أسئلة حتى الآن. كن أول من يطرح سؤالاً!
                </div>
              ) : (
                lectureComments.map((com) => (
                  <div 
                    key={com.id} 
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3"
                  >
                    {/* Comment Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          com.isTeacher 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {com.isTeacher ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {com.isTeacher ? 'المسؤول' : com.studentName}
                            </span>
                            {com.isTeacher ? (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] rounded font-bold">
                                المسؤول
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] rounded font-bold">
                                {com.studentGroup || com.studentGrade || 'طالب'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {formatArabicDate(com.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pr-10">
                      {com.text}
                    </p>

                    {/* Replies Thread */}
                    {com.replies && com.replies.length > 0 && (
                      <div className="pr-6 sm:pr-10 space-y-2.5 pt-2 border-r-2 border-blue-500/30">
                        {com.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              rep.authorRole === 'teacher'
                                ? 'bg-amber-950/30 border border-amber-500/30 text-amber-100'
                                : 'bg-slate-900 border border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5">
                                {rep.authorRole === 'teacher' && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                )}
                                <span className={rep.authorRole === 'teacher' ? 'text-amber-300' : 'text-blue-300'}>
                                  {rep.authorRole === 'teacher' ? 'المسؤول' : rep.authorName}
                                </span>
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatArabicDate(rep.createdAt)}
                              </span>
                            </div>
                            <p className="leading-relaxed text-slate-200">{rep.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Action Form */}
                    <div className="pr-10 pt-1">
                      {activeReplyId === com.id ? (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            value={replyInputs[com.id] || ''}
                            onChange={(e) =>
                              setReplyInputs({ ...replyInputs, [com.id]: e.target.value })
                            }
                            placeholder={isAdmin ? 'اكتب رد المسؤول هنا...' : 'اكتب تعقيبك...'}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePostReply(com.id)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <CornerDownLeft className="w-3.5 h-3.5" />
                            <span>رد</span>
                          </button>
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="px-2 py-2 text-slate-400 hover:text-white text-xs"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReplyId(com.id)}
                          className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                        >
                          <CornerDownLeft className="w-3 h-3" />
                          <span>{isAdmin ? 'إضافة رد المسؤول' : 'إضافة رد'}</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Sidebar: Course Playlist & Chapter Navigation */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="text-base">{subject.icon}</span>
                <span>فهرس محاضرات المادة</span>
              </h3>
            </div>

            {/* Sections Accordion */}
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {subject.sections.map((sec) => (
                <div key={sec.id} className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-950/60 rounded-lg flex items-center justify-between">
                    <span>{sec.title}</span>
                    <span className="text-[10px] text-slate-500">{sec.lectures.length} محاضرات</span>
                  </div>

                  <div className="space-y-1 mr-2">
                    {sec.lectures.map((lec) => {
                      const isCurrent = lec.id === currentLecture.id;
                      return (
                        <button
                          key={lec.id}
                          onClick={() => onSelectLecture(sec, lec)}
                          className={`w-full text-right p-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2.5 ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                              : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <PlayCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? 'text-white' : 'text-blue-400'}`} />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate">{lec.title}</p>
                            <div className="flex items-center gap-2 text-[10px] opacity-80 mt-0.5">
                              <span>{lec.durationMinutes} دقيقة</span>
                              {lec.isFreePreview && (
                                <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded text-[9px]">
                                  مجانية
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
