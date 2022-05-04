import {CSSProperties, useCallback, useMemo, useState} from "react";
import styles from "../styles/Planetary.module.css";

const MAX_ORBITS = 5;

function Orbit({index}: { index: number }): JSX.Element {
    const color = useMemo(() => {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }, []);
    const speed = useMemo(() => {
        return `${Math.random() * 30 + 10}s`;
    }, []);
    const size = useMemo(() => {
        return `${Math.random() * 20 + 10}px`;
    }, []);
    return (
        <div className={`${styles.orbit} ${styles.sizable}`} style={{
            "--size": `${index * 120 + 40}px`
        } as unknown as CSSProperties}>
            <div className={styles.planet} style={{
                "--color": color,
                "--size": size,
                "--revolution": speed
            } as unknown as CSSProperties}>
                ORBIT
            </div>
        </div>
    )
}

export default function Planetary(): JSX.Element {

    const [orbitData, setOrbitData] = useState<string[]>([]);
    const orbits = useMemo<JSX.Element[]>(() => {
        return orbitData.map((k, i) => <Orbit key={k} index={i}/>)
    }, [orbitData]);

    const addOrbit = useCallback(() => {
        setOrbitData(prev => {
            const randID = Math.random().toString().slice(2);
            const nextData = [randID, ...prev];
            while (nextData.length > MAX_ORBITS) nextData.pop();
            return nextData;
        })
    }, [setOrbitData]);

    return (
        <div className={styles.planetary}>
            <button className={`${styles.sun} ${styles.sizable}`} onClick={addOrbit}/>
            <div className={styles.system}>
                {orbits}
            </div>
        </div>
    );
}