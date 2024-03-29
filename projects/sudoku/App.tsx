import { useCallback, useState } from "react";
import { DIFFICULTY, ISudoku } from "./types";
import { generateSudoku } from "./sudokuGenerator";
import { Sudoku } from "./components/Sudoku";
import { Menu } from "./components/Menu";
import styles from "./styles/App.module.css";

export function App(): JSX.Element {

  const [difficulty, setDifficulty] = useState(DIFFICULTY.Easy);
  const [isDarkMode, setDarkMode] = useState(false);
  const [sudoku, setSudoku] = useState<undefined | ISudoku>();

  const buildSudoku = useCallback(() => {
    setSudoku(generateSudoku(difficulty));
  }, [difficulty]);

  return (
    <main className={`${styles.app} ${isDarkMode ? styles.darkMode : ""}`}>
      {
        sudoku ?
          <Sudoku
            sudoku={sudoku}
            onExit={() => {
              setSudoku(undefined);
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