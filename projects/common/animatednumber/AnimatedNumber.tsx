import React, {ReactNode, useEffect, useMemo, useState} from "react";
import styles from "./AnimatedNumber.module.css";
import {DigitWheel} from "./DigitWheel";

interface AnimatedNumberProps {
  appendix?: ReactNode;
  prefix?: ReactNode;
  startNumber?: number;
  endNumber: number;
  // in millisecond
  duration?: number,
  speed?: number,
  className?: string,
  numbersClassName?: string,
  wheelsClassName?: string,
  triggerAnimation?: unknown,
  resetAnimation?: unknown,
  delay?: number
}

export function AnimatedNumber({
                                 appendix = "",
                                 prefix = "",
                                 startNumber = 0,
                                 endNumber,
                                 duration = 3000,
                                 className = "",
                                 numbersClassName = "",
                                 wheelsClassName = "",
                                 triggerAnimation,
                                 resetAnimation,
                                 delay = 0
                               }: AnimatedNumberProps): JSX.Element {


  const targetNumbers = useMemo(() => {
    return Array.from({length: endNumber - startNumber + 1}).map((_, i) => i);
  }, [startNumber, endNumber]);

  const digits = useMemo(() => {
    return targetNumbers.at(-1)?.toFixed().length || 0;
  }, [targetNumbers]);

  const [activeIndex, setActiveIndex] = useState(0);

  const wheels = useMemo(() => {
    return Array.from({length: digits}).map((_, i) => {
      const asString = targetNumbers.at(activeIndex)?.toFixed().padStart(digits, "0");
      const value = asString ? parseInt(asString.slice(0, i + 1)) : 0;
      return <DigitWheel key={i} value={value} className={wheelsClassName}/>;
    });
  }, [digits, targetNumbers, activeIndex, wheelsClassName]);

  useEffect(() => {
    const speed = 20;
    const timeout = duration / speed / targetNumbers.length;

    function switchNumber() {
      setActiveIndex(prev => {
        if (prev >= targetNumbers.length - 1) {
          return prev;
        }

        setTimeout(switchNumber, timeout);
        return prev + 1
      });
    }

    setActiveIndex(0);

    setTimeout(() => {
      switchNumber();
    }, delay);
  }, [triggerAnimation, delay, duration, targetNumbers]);

  useEffect(() => {
    setActiveIndex(0);
  }, [resetAnimation]);

  return (
    <div className={`${styles.container} ${className}`}>
      {prefix}
      <div className={`${styles.wheels} ${numbersClassName}`}>
        {wheels}
      </div>
      {appendix}
    </div>
  );
}
