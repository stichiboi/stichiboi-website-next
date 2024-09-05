import React, {ReactNode, useEffect, useMemo, useState} from "react";
import styles from "./AnimatedNumber.module.css";

interface AnimatedNumberProps {
  appendix?: ReactNode;
  prefix?: ReactNode;
  startNumber?: number;
  endNumber: number;
  // in millisecond
  duration?: number,
  speed?: number,
  className?: string,
  triggerAnimation?: unknown,
  delay?: number
}

export function AnimatedNumber({
                                 appendix = "",
                                 prefix = "",
                                 startNumber = 0,
                                 endNumber,
                                 duration = 50000,
                                 speed = 100,
                                 className = "",
                                 triggerAnimation,
                                 delay = 0
                               }: AnimatedNumberProps): JSX.Element {

  const targetNumbers = useMemo(() => {
    let numbersLength = Math.min(duration / speed, (endNumber - startNumber) * 2);
    // if (numbersLength < (endNumber - startNumber)) {
    //   numbersLength = endNumber - startNumber;
    // }
    const numberJump = (endNumber - startNumber) / numbersLength;
    const numbers = []
    for (let i = startNumber; i <= endNumber; i += numberJump) {
      numbers.push((i)?.toFixed(0));
    }
    return numbers;
  }, [speed, duration, startNumber, endNumber]);

  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {

    function switchNumber() {
      setActiveIndex(prev => {
        if (prev >= targetNumbers.length - 1) {
          return prev;
        }
        setTimeout(switchNumber, speed);
        return prev + 1
      });
    }

    setActiveIndex(0);

    setTimeout(() => {
      switchNumber();
    }, delay);
  }, [triggerAnimation, delay, speed, targetNumbers]);

  return (
    <div className={`${styles.container} ${className}`}>
      {prefix}
      {targetNumbers[activeIndex]}
      {appendix}
    </div>
  );
}
