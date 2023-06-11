import styles from "./styles/App.module.css";
import { Chart } from "./components/Chart";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAnalyser } from "./useAnalyser";
import { Controls } from "./components/Controls";

// the delta between amplitude and average will be raised to this power
// note: the value will always be < 1 -> power needs to be fractional to accentuate the delta.
// otherwise, you can put a value > 1 to dampen it
const NOISE_POWER = 1 / 1.5;


export function App(): JSX.Element {

  // values within this margin of the average will be considered as 0 for the noise calculation
  // useful to remove background noise
  const [noiseMargin, setNoiseMargin] = useState(10);
  const [memoryDuration, setMemoryDuration] = useState(60);

  // lower is better
  const [noise, setNoise] = useState(0);

  const [amplitude, setAmplitude] = useState<number[]>([]);
  const [frequency, setFrequency] = useState<number[]>([]);
  // ref is required since its value is used in animation frame callback
  const isRunningRef = useRef<boolean>();

  const analyser = useAnalyser();

  useEffect(() => {
    const totalAmplitude = amplitude.reduce((prev, curr) => prev + curr, 0);
    const average = totalAmplitude / amplitude.length;
    const margin = average * noiseMargin / 10;
    const noise = amplitude.reduce((prev, curr) => {
      const delta = curr - average;
      if (delta < average + margin) {
        return prev;
      }
      if (delta > 0) {
        return prev + Math.pow(delta, NOISE_POWER);
      }
      return prev + delta;
    }, 0);
    setNoise(noise);
  }, [amplitude, noiseMargin]);

  function shouldDraw(analyser: AnalyserNode | undefined): analyser is AnalyserNode {
    return Boolean(analyser) && Boolean(isRunningRef.current);
  }

  const drawAmplitude = useCallback(() => {
    if (!shouldDraw(analyser)) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    const sum = dataArray.reduce((prev, curr) => {
      return prev + Math.pow(curr - 128, 2);
    }, 0);
    const avgAmplitude = Math.sqrt(sum / bufferLength) / 64;

    // assume the frame rate is 60 fps
    const memorySize = memoryDuration * 60;
    setAmplitude(prevState => {
      const next = prevState.slice(prevState.length - memorySize);
      next.push(avgAmplitude);
      return next;
    });
  }, [analyser, memoryDuration]);

  const drawFrequency = useCallback(() => {
    if (!shouldDraw(analyser)) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    setFrequency(prev => {
      const curr = Array.from(dataArray).map(x => x / 128 - .5);
      if (prev.length !== curr.length) {
        return curr;
      }
      return curr.map((c, index) => {
        const p = prev[index];
        // smooth change
        return p + (c - p) / 10;
      })
    });
  }, [analyser]);

  return (
    <main className={styles.main}>
      <p className={styles.score}>{noise.toFixed(2)}</p>
      <Controls
        onRunningToggle={value => isRunningRef.current = value}
        setNoiseMargin={setNoiseMargin}
        setMemoryDuration={setMemoryDuration}
      />
      <Chart data={amplitude} draw={drawAmplitude}/>
      <Chart data={frequency} draw={drawFrequency}/>
    </main>
  );
}