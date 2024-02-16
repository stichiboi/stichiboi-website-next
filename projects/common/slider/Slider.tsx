import {useStateLocalStorage} from "../hooks/useStateLocalStorage";
import {ReactNode, useEffect} from "react";
import styles from "./slider.module.css";

interface SliderProps {
    id: string,
    min: number,
    max: number,
    step: number,
    label: ReactNode,
    onChange: (v: number) => unknown,
    defaultValue: number,
    showValue?: boolean,
    tooltip?: string
}

export function Slider({defaultValue, id, min, max, step, label, onChange, showValue, tooltip}: SliderProps) {
    const [value, setValue] = useStateLocalStorage(defaultValue, id);

    useEffect(() => {
        onChange(value);
    }, [onChange, value]);

    return (
        <div className={styles.container} title={tooltip}>
            {label}
            <div className={styles.content}>
                <input
                    id={id}
                    className={styles.slider}
                    type={"range"}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={ev => setValue(parseInt(ev.target.value))}
                />
                {showValue && <p>{value}</p>}
            </div>
        </div>
    )
}