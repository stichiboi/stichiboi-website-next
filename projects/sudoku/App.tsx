import { useCallback, useEffect, useState } from "react";
import { DIFFICULTY, ISudoku } from "./types/types";
import { generateSudoku } from "./sudokuGenerator";
import { Sudoku } from "./components/Sudoku";
import { Menu } from "./components/Menu";
import styles from "./styles/App.module.css";

export function App(): JSX.Element {

  const [difficulty, setDifficulty] = useState(DIFFICULTY.Easy);
  const [isDarkMode, setDarkMode] = useState(false);
  const [sudoku, setSudoku] = useState<undefined | ISudoku>();

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (body) {
      if (isDarkMode)
        body.classList.add('dark-mode');
      else
        body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const buildSudoku = useCallback(() => {
    setSudoku(generateSudoku(difficulty));
  }, [difficulty]);

  return (
    <main className={`${styles.app} ${isDarkMode ? styles.darkMode : ""}`}>
      {
        sudoku ?
          <Sudoku
            sudoku={sudoku}
            onExit={(playAgain) => {
              setSudoku(playAgain ? generateSudoku(difficulty) : undefined);
            }}
          />
          :
          <Menu
            setDifficulty={setDifficulty}
            onStartGame={buildSudoku}
            toggleDarkMode={setDarkMode}
          />
      }
    </main>
  );
}