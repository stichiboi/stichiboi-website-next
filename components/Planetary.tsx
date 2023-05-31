import { CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import styles from "../styles/Planetary.module.css";

const MAX_ORBITS = 4;

function generateColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function generateGradient() {
  const angle = Math.random() * 360;
  const col1 = generateColor(), col2 = generateColor();
  return `linear-gradient(${angle}deg, ${col1}, ${col2})`;
}

function Orbit({ index, onTransitionEnd }: {
  index: number,
  onTransitionEnd?: () => unknown,
}): JSX.Element {
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

  useEffect(() => {
    if (onTransitionEnd) {
      setTimeout(onTransitionEnd, 1200);
    }
  }, [onTransitionEnd]);
  return (
    <div
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

  const [orbitData, setOrbitData] = useState<string[]>(Array.from({ length: 4 }).map((_, i) => `default_${i}`));
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const orbits = useMemo<JSX.Element[]>(() => {
    return orbitData.map((k, i) => (
      <Orbit
        key={k}
        index={i}
        onTransitionEnd={i > MAX_ORBITS ? () => {
          setOrbitData(prev => prev.filter(id => k !== id))
        } : undefined}
      />
    ));
  }, [orbitData]);

  const addOrbit = useCallback(() => {
    setOrbitData(prev => {
      const randID = Math.random().toString().slice(2);
      return [randID, ...prev];
    });
  }, [setOrbitData]);

  return (
    <div
      className={styles.planetary}
      onMouseEnter={() => {
        setTriggerAnimation(prev => {
          const nextId = prev + 1;
          setTimeout(() => {
            setTriggerAnimation(prev => {
              // reset the style only if another animation has not been triggered
              // otherwise it will interrupt that animation mid-way
              return prev === nextId ? 0 : prev;
            })
            // set a bigger delay than the animation to avoid too many interactions while moving the mouse
          }, 3000);
          return nextId;
        });
      }}>
      <button className={`${styles.sun} ${styles.sizable}`} onClick={addOrbit}/>
      <div className={`${styles.system} ${triggerAnimation ? styles.quickSpin : ""}`}>
        {orbits}
      </div>
    </div>
  );
}