export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

// Convert YouTube or Vimeo or direct links to embeddable URLs
export function getEmbedVideoUrl(url: string): { type: 'youtube' | 'vimeo' | 'direct' | 'embed'; embedUrl: string } {
  if (!url) return { type: 'direct', embedUrl: '' };

  const trimmed = url.trim();

  // YouTube formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1&vq=hd1080&hd=1`,
    };
  }

  // Vimeo formats:
  // - https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1])) {
    const id = vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=0`,
    };
  }

  // If already an embed URL or starts with http and ends with mp4/webm
  if (trimmed.includes('/embed/') || trimmed.includes('player.')) {
    return { type: 'embed', embedUrl: trimmed };
  }

  return { type: 'direct', embedUrl: trimmed };
}

// Generate human-friendly activation code
export function generateStudentCode(prefix: string = 'EDU', subjectTag: string = ''): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const tag = subjectTag ? `-${subjectTag.toUpperCase().slice(0, 4)}` : '';
  const year = new Date().getFullYear();
  return `${prefix}-${randomNum}${tag}-${year}`;
}

// Build WhatsApp sharing link with student credentials
export function createWhatsAppShareLink(phone: string, studentName: string, code: string, subjectsNames: string[]): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.startsWith('07') ? `964${cleanPhone.slice(1)}` : cleanPhone;

  const message = `السلام عليكم عزيزنا الطالب *${studentName}* 🌸
تم تفعيل اشتراكك في المنصة التعليمية بنجاح!

🔑 *كود الدخول الخاص بك:*
\`${code}\`

📚 *المواد المتاحة لك:*
${subjectsNames.length > 0 ? subjectsNames.map(s => `• ${s}`).join('\n') : '• جميع المواد'}

🌐 *رابط المنصة:*
${typeof window !== 'undefined' ? window.location.origin : 'https://edu-platform.iq'}

يرجى إدخال الكود في واجهة تسجيل الدخول لمشاهدة كافة المحاضرات والملازم. نتمنى لك التوفيق والنجاح الدائم! 🎓✨`;

  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
}

// Arabic date formatting
export function formatArabicDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}
