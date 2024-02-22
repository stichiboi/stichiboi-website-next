import {useEffect} from "react";

export function useEventListener(type: keyof WindowEventMap | (keyof WindowEventMap)[], callback: (ev: Event) => unknown, options?: boolean | AddEventListenerOptions) {
  useEffect(() => {
    const eventTypes = Array.isArray(type) ? type : [type];
    eventTypes.forEach(t => window.addEventListener(t, callback), options);
    return () => {
      eventTypes.forEach(t => window.removeEventListener(t, callback), options);
    }
  }, [type, callback, options]);
}