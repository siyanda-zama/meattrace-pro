import { useEffect, useRef } from "react";

export function useFormAutosave(key: string, data: unknown, interval = 30000) {
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      try {
        localStorage.setItem(`mt_autosave_${key}`, JSON.stringify(data));
      } catch { /* quota exceeded */ }
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [key, data, interval]);

  return {
    restore: (): unknown => {
      try {
        const saved = localStorage.getItem(`mt_autosave_${key}`);
        return saved ? JSON.parse(saved) : null;
      } catch { return null; }
    },
    clear: () => localStorage.removeItem(`mt_autosave_${key}`),
  };
}
