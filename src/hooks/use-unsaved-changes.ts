import { useEffect, useCallback, useRef } from "react";

export function useUnsavedChanges(isDirty: boolean) {
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  const handler = useCallback((e: BeforeUnloadEvent) => {
    if (dirtyRef.current) {
      e.preventDefault();
      e.returnValue = "";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [handler]);
}
