/**
 * Utility: format seconds to MM:SS
 */
export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

/**
 * Utility: format a date string to locale date
 */
export const formatDate = (dateStr: string, locale = 'en-IN'): string => {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Utility: extract user name from the nested session object
 * Handles both `{ user: { name } }` and `{ name }` shapes
 */
export const getUserName = (user: any, fallback = 'User'): string =>
  user?.user?.name || user?.name || fallback;

/**
 * Utility: extract user email from the nested session object
 */
export const getUserEmail = (user: any): string =>
  user?.user?.email || user?.email || '';

/**
 * Utility: extract user id from the nested session object
 */
export const getUserId = (user: any): number =>
  user?.user?.id || user?.id || 1;

/**
 * Utility: extract user token
 */
export const getUserToken = (user: any): string =>
  user?.token || '';

/**
 * Utility: get verdict color hex
 */
export const getVerdictColor = (verdict: string): string => {
  if (verdict === 'HIRE')   return '#00B87C';
  if (verdict === 'REVIEW') return '#F59E0B';
  return '#FF4444';
};
