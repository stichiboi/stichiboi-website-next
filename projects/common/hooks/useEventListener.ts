import {useEffect} from "react";

export function useEventListener(type: keyof WindowEventMap, callback: (ev: Event) => unknown) {
    useEffect(() => {
        window.addEventListener(type, callback);
        return () => {
            window.removeEventListener(type, callback);
        }
    }, [type, callback]);
}