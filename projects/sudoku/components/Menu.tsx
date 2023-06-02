import { Stepper } from "./Stepper";
import { DIFFICULTY } from "../types/types";
import { Toggle } from "./Toggle";
import { HalfMoon, SunLight } from "iconoir-react";
import styles from "../styles/Menu.module.css"; // Import the CSS module

interface MenuProps {
  setDifficulty: (difficulty: number) => unknown;
  onStartGame: () => unknown;
  toggleDarkMode: (value: boolean) => unknown;
}

export function Menu({ setDifficulty, onStartGame, toggleDarkMode }: MenuProps): JSX.Element {
  return (
    <div className={styles.menu}>
      <div className={styles.difficultyPicker}>
        <h3>{"Difficulty"}</h3>
        <Stepper
          saveKey={"stichi-sudoku-difficulty"}
          onChange={(value) => setDifficulty(value)}
          max={DIFFICULTY.Hard}
          min={DIFFICULTY.Trivial}
        />
      </div>
      <button className={styles.buttonCta} onClick={onStartGame}>
        {"New Game"}
      </button>
      <Toggle
        saveKey={"stichi-sudoku-dark-mode"}
        onToggle={toggleDarkMode}
        leftIcon={<SunLight/>}
        rightIcon={<HalfMoon/>}
        className={styles.toggleDarkMode}
      />
    </div>
  );
}
