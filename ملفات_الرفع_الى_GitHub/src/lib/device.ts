'use client';

const DEVICE_ID_STORAGE_KEY = 'edu_platform_device_fingerprint_v1';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-dev';
  try {
    let id = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    }
    return id;
  } catch (e) {
    return 'fallback_dev_' + Date.now();
  }
}

export function getFriendlyDeviceName(): string {
  if (typeof window === 'undefined') return 'جهاز غير معروف';

  const ua = navigator.userAgent;
  let os = 'جهاز كمبيوتر';

  if (/iPhone/i.test(ua)) os = 'iPhone (iOS)';
  else if (/iPad/i.test(ua)) os = 'iPad (iOS)';
  else if (/Android/i.test(ua)) os = 'هاتف أندرويد (Android)';
  else if (/Windows/i.test(ua)) os = 'حاسوب ويندوز (Windows)';
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'حاسوب ماك (macOS)';
  else if (/Linux/i.test(ua)) os = 'نظام لينكس (Linux)';

  let browser = '';
  if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge|Edg/i.test(ua)) browser = 'Edge';

  return browser ? `${os} - ${browser}` : os;
}
