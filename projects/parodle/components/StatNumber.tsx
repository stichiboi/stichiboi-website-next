import styles from "../styles/StatNumber.module.css"
import {AnimatedNumber} from "../../common/animatednumber/AnimatedNumber";

interface StatNumberProps {
  label: string;
  value: number;
  appendix?: string;
  triggerAnimation: unknown
  delay: number
}

export function StatNumber({label, value, appendix, triggerAnimation, delay}: StatNumberProps) {
  return (
    <div className={styles.container}>
      <AnimatedNumber
        className={styles.value}
        appendix={appendix}
        endNumber={value}
        triggerAnimation={triggerAnimation}
        delay={delay}
      />
      <em className={styles.label}>{label}</em>
    </div>
  )
}