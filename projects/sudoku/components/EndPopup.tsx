import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import styles from "../styles/EndPopup.module.css";
import { ButtonCTA } from "./ButtonCTA";

interface EndPopup {
  onExit: () => unknown,
  isComplete: boolean,
  timer: string
}

export default function EndPopup({ onExit, isComplete, timer }: EndPopup) {
  const [_triggerConfetti, _setTriggerConfetti] = useState(0);

  const throwConfetti = useCallback(() => _setTriggerConfetti(prev => ++prev), []);

  //Confetti
  useEffect(() => {
    if (isComplete) {
      throwConfetti();
    }
  }, [isComplete, throwConfetti]);

  useEffect(() => {
    function fire(particleRatio: number, opts?: confetti.Options) {
      const count = 200;
      const defaults = {
        origin: { y: 1 }
      };
      return confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    function bigConfetti() {
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }

    function smallConfetti() {
      fire(0.5, {
        particleCount: 100,
        spread: 70
      });
    }

    if (_triggerConfetti) {
      Math.random() > 0.5 ? smallConfetti() : bigConfetti();
    }
  }, [_triggerConfetti]);

  return (
    <div
      onMouseEnter={throwConfetti}
      className={`${styles.popup} ${isComplete ? styles.toggled : ''}`}>
      <button className={styles.text} onClick={throwConfetti}>
        {`Completed in ${timer} 🎉`}
      </button>
      <ButtonCTA onClick={onExit}>
        {"Menu"}
      </ButtonCTA>
    </div>
  )
}