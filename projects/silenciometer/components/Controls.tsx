import styles from "../styles/Controls.module.css";
import { Pause, Play } from "iconoir-react";
import React, { useEffect, useState } from "react";

interface ControlsProps {
  onRunningToggle: (v: boolean) => unknown
}

export function Controls({ onRunningToggle }: ControlsProps): JSX.Element {
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    onRunningToggle(isRunning);
  }, [isRunning, onRunningToggle])
  return (
    <div className={styles.controls}>
      <button
        className={styles.start}
        onClick={() => setIsRunning(prev => !prev)}
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? <Pause width={72} height={72}/> : <Play width={72} height={72}/>}
      </button>
    </div>
  )
}