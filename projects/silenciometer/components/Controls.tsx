import styles from "../styles/Controls.module.css";
import { Pause, Play, Settings, Barcode, SineWave } from "iconoir-react";
import { useEffect, useMemo, useState } from "react";
import { Stepper } from "../../common/stepper/Stepper";
import { Popup } from "../../common/popup/Popup";
import { Toggle } from "../../common/toggle/Toggle";

interface ControlsProps {
  onRunningToggle: (v: boolean) => unknown,
  setNoiseMargin: (v: number) => unknown,
  setMemoryDuration: (v: number) => unknown,
  setChartMode: (v: number) => unknown
}

export function Controls({
  onRunningToggle,
  setNoiseMargin,
  setMemoryDuration,
  setChartMode
}: ControlsProps): JSX.Element {
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    onRunningToggle(isRunning);
  }, [isRunning, onRunningToggle]);

  const settings = useMemo(() => {
    return (
      <>
        <Stepper
          label={"Background noise margin"}
          explanation={"A higher value means more background noise will be ignored"}
          saveKey={"noise-margin"}
          onChange={setNoiseMargin}
          stepSize={5}
          defaultValue={10}
          min={5}
          max={80}
          displayValue={value => `${value}%`}
        />
        <Stepper
          label={"Memory Duration"}
          explanation={"How long before the noise is forgotten"}
          saveKey={"memory-duration"}
          onChange={setMemoryDuration}
          defaultValue={60}
          stepSize={5}
          min={10}
          max={180}
          displayValue={value => `${value}s`}
        />
        <Toggle
          saveKey={"silenciometer-graph-mode"}
          onToggle={value => setChartMode(value ? 1 : 0)}
          leftIcon={<Barcode/>} rightIcon={<SineWave/>}
        />
      </>
    );
  }, [setChartMode, setMemoryDuration, setNoiseMargin]);
  return (
    <div className={styles.controls}>
      <button
        className={styles.start}
        onClick={() => setIsRunning(prev => !prev)}
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? <Pause width={72} height={72}/> : <Play width={72} height={72}/>}
      </button>
      <Popup
        label={<Settings/>}
        labelClassName={styles.popover}
        containerClassName={styles.panel}
      >
        {settings}
      </Popup>
    </div>
  )
}