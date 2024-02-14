import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function useStateLocalStorage<T extends (number | string)>(defaultValue: T, id: string): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        const saved = localStorage.getItem(id);
        if (saved) {
            if (typeof defaultValue === 'number') {
                const savedNumber = parseInt(saved);
                if (!isNaN(savedNumber)) {
                    setValue(savedNumber as T);
                }
            } else {
                setValue(saved as T);
            }
        }
    }, [id]);

    useEffect(() => {
        // call in setValue to ensure it's always the latest value
        setValue(prev => {
            localStorage.setItem(id, prev.toString());
            return prev;
        });
    }, [value, id]);
    return [value, setValue];
}