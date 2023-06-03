import { useCallback, useEffect, useState } from "react";
import { Reflexer } from "./components/Reflexer";
import { SettingsContext } from "./components/SettingsContext";
import { Menu } from "./components/Menu";
import { ResultType } from "./types/types";

export function App(): JSX.Element {
  const [numberOfTries, setNumberOfTries] = useState(3);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ResultType[]>([]);

  useEffect(() => {
    if (results.length >= numberOfTries) {
      setRunning(false);
    }
  }, [numberOfTries, results]);

  const start = useCallback(() => {
    console.log("Starting", running);
    if (!running) {
      setResults([]);
      setRunning(true);
    }
  }, [running]);

  return (
    <SettingsContext.Provider value={{ numberOfTries, setNumberOfTries }}>
      <Reflexer
        isRunning={running}
        onResult={result => {
          setResults(prev => prev.concat(result));
        }}
      />
      <Menu isRunning={running} onStart={start} results={results}/>
    </SettingsContext.Provider>
  );
}