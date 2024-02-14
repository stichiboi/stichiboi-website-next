import {useStateLocalStorage} from "../hooks/useStateLocalStorage";
import {useEffect} from "react";

interface SliderProps {
    id: string,
    min: number,
    max: number,
    step: number,
    label: string,
    onChange: (v: number) => unknown,
    defaultValue: number
}

export function Slider({defaultValue, id, min, max, step, label, onChange}: SliderProps) {
    const [value, setValue] = useStateLocalStorage(defaultValue, id);

    useEffect(() => {
        console.log(value);
        onChange(value);
    }, [onChange, value]);

    return (
        <div>
            <label>{label}</label>
            <input type={"range"} min={min} max={max} step={step} onChange={ev => setValue(parseInt(ev.target.value))}/>
        </div>
    )
}