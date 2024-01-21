import styles from "../styles/Controls.module.css";
import {Pause, Play, Settings, Barcode, SineWave} from "iconoir-react";
import {useEffect, useMemo, useState} from "react";
import {Stepper} from "../../common/stepper/Stepper";
import {Popup} from "../../common/popup/Popup";
import {Toggle} from "../../common/toggle/Toggle";
import {Checkbox} from "../../common/checkbox/Checkbox";
import Logo from "../../../public/stichiboi-logo.svg";
import Link from "next/link";

interface ControlsProps {
  onRunningToggle: (v: boolean) => unknown,
  setNoiseMargin: (v: number) => unknown,
  setMemoryDuration: (v: number) => unknown,
  setChartMode: (v: number) => unknown,
  setBackgroundOnSilence: (v: boolean) => unknown,
}

export function Controls({
                           onRunningToggle,
                           setNoiseMargin,
                           setMemoryDuration,
                           setChartMode,
                           setBackgroundOnSilence
                         }: ControlsProps): JSX.Element {
  const [isRunning, setIsRunning] = useState(true);

  // firstRender and secondRender are used to trigger and open-close of the popup, which loads the initial settings
  const [firstRender, setFirstRender] = useState(true);
  const [secondRender, setSecondRender] = useState(false);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (!firstRender) {
      setSecondRender(true);
    }
  }, [firstRender]);

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
        <hr/>
        <Toggle
          saveKey={"silenciometer-graph-mode"}
          onToggle={value => setChartMode(value ? 1 : 0)}
          leftIcon={<Barcode/>} rightIcon={<SineWave/>}
        />
        <Checkbox
          saveKey={"silenciometer-background-on-silence"}
          onToggle={setBackgroundOnSilence}
          label={"Show background when silent"}
        />
      </>
    );
  }, [setChartMode, setMemoryDuration, setNoiseMargin]);
  return (
    <div className={styles.controls}>
      <div className={styles.navigation}>
        <Popup
          label={<Settings/>}
          labelClassName={styles.popover}
          containerClassName={styles.panel}
          triggerOpen={firstRender}
          triggerClose={secondRender}
          placement={'top-start'}
        >
          {settings}
        </Popup>
        <button
          className={styles.start}
          onClick={() => setIsRunning(prev => !prev)}
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Pause/> : <Play/>}
        </button>
        <Link className={styles.logo} href={"/"} passHref>
          <Logo/>
        </Link>
      </div>
    </div>
  )
}