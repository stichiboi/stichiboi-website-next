import { useCallback, useEffect, useState } from "react";
import { Reflexer } from "./components/Reflexer";
import { SettingsContext } from "./components/SettingsContext";
import { Menu } from "./components/Menu";
import { ResultType } from "./types/types"

export function App(): JSX.Element {
  const [numberOfTries, setNumberOfTries] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ResultType[]>([]);

  useEffect(() => {
    if (results.length >= numberOfTries) {
      setIsRunning(false);
    }
  }, [numberOfTries, results]);

  const start = useCallback(() => {
    if (!isRunning) {
      setResults([]);
      setIsRunning(true);
    }
  }, [isRunning]);

  const onResult = useCallback((result: ResultType) => {
    setResults(prev => prev.concat(result));

  }, []);

  return (
    <SettingsContext.Provider value={{ numberOfTries, setNumberOfTries }}>
      {
        isRunning &&
          <Reflexer
            onResult={onResult}
          />
      }
      <Menu isRunning={isRunning} onStart={start} results={results}/>
    </SettingsContext.Provider>
  );
}