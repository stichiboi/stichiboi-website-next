import {ReactNode, useEffect} from "react";
import styles from "./EndPopup.module.css";
import {ButtonCTA} from "../button/ButtonCTA";
import {useConfetti} from "../confetti/useConfetti";

interface EndPopup {
  onExit: () => unknown,
  exitCta: string,
  isVisible: boolean,
  children: ReactNode,
  withConfetti?: boolean
}

export default function EndPopup({onExit, exitCta, isVisible, children, withConfetti = true}: EndPopup) {
  const throwConfetti = useConfetti();

  useEffect(() => {
    if (isVisible && withConfetti) {
      throwConfetti();
    }
  }, [isVisible, throwConfetti]);

  return (
    <div
      onMouseEnter={() => withConfetti && throwConfetti()}
      className={`${styles.popup} ${isVisible ? styles.toggled : ''}`}>
      <div role={"button"} className={styles.text} onClick={() => withConfetti && throwConfetti()}>
        {children}
      </div>
      <ButtonCTA onClick={onExit}>
        {exitCta}
      </ButtonCTA>
    </div>
  )
}