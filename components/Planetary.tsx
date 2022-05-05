import {CSSProperties, useCallback, useMemo, useState} from "react";
import styles from "../styles/Planetary.module.css";

const MAX_ORBITS = 5;

function generateColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function generateGradient() {
    const angle = Math.random() * 360;
    const col1 = generateColor(), col2 = generateColor();
    return `linear-gradient(${angle}deg, ${col1}, ${col2})`;
}

function Orbit({index, onTransitionEnd}: { index: number, onTransitionEnd?: () => unknown }): JSX.Element {
    const color = useMemo(() => {
        if (Math.random() > 0.5) {
            return generateColor();
        }
        return generateGradient();
    }, []);
    const speed = useMemo(() => {
        return `${Math.random() * 30 + 10}s`;
    }, []);
    const size = useMemo(() => {
        return `${Math.random() * 20 + 10}px`;
    }, []);
    const offset = useMemo(() => {
        return `-${Math.random() * 20 + 10}s`;
    }, []);
    return (
        <div
            onTransitionEnd={onTransitionEnd}
            className={`${styles.orbit} ${styles.sizable} ${onTransitionEnd ? styles.fadeOut : ''}`}
            style={{
                "--size": `${index * 120 + 40}px`,
                "--offset": offset
            } as unknown as CSSProperties}>
            <div
                className={`${styles.planet} ${styles.sizable}`}
                style={{
                    "--color": color,
                    "--size": size,
                    "--revolution": speed
                } as unknown as CSSProperties}/>
        </div>
    )
}

export default function Planetary(): JSX.Element {

    const [orbitData, setOrbitData] = useState<string[]>(['def_first', 'def_second', 'def_third', 'def_fourth']);
    const [toDelete, setToDelete] = useState<string[]>([]);
    const orbits = useMemo<JSX.Element[]>(() => {
        const stable = orbitData.map((k, i) => (
            <Orbit key={k} index={i}/>
        ));
        const fading = toDelete.map((k, i) =>
            <Orbit
                key={k}
                index={i + stable.length}
                onTransitionEnd={() => {
                    setToDelete(prev => prev.filter(id => id !== k))
                }}
            />);
        return [...stable, ...fading];
    }, [orbitData, toDelete]);

    const addOrbit = useCallback(() => {
        setOrbitData(prev => {
            const randID = Math.random().toString().slice(2);
            const nextData = [randID, ...prev];
            const toDelete = nextData.splice(MAX_ORBITS);
            setToDelete(toDelete);
            return nextData;
        });
    }, [setOrbitData, setToDelete]);

    return (
        <div className={styles.planetary}>
            <button className={`${styles.sun} ${styles.sizable}`} onClick={addOrbit}/>
            <div className={styles.system}>
                {orbits}
            </div>
        </div>
    );
}