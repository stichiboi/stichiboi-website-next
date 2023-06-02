import { Stepper } from "./Stepper";
import { DIFFICULTY } from "../types/types";
import { Toggle } from "./Toggle";
import { HalfMoon, SunLight } from "iconoir-react";
import styles from "../styles/Menu.module.css";
import { ButtonCTA } from "./ButtonCTA"; // Import the CSS module

interface MenuProps {
  setDifficulty: (difficulty: number) => unknown;
  onStartGame: () => unknown;
  toggleDarkMode: (value: boolean) => unknown;
}

export function Menu({ setDifficulty, onStartGame, toggleDarkMode }: MenuProps): JSX.Element {
  return (
    <div className={styles.menu}>
      <div className={styles.difficultyPicker}>
        <Stepper
          label={"Difficulty"}
          saveKey={"stichi-sudoku-difficulty"}
          onChange={(value) => setDifficulty(value)}
          max={DIFFICULTY.Hard}
          min={DIFFICULTY.Trivial}
        />
      </div>
      <ButtonCTA onClick={onStartGame}>
        {"New Game"}
      </ButtonCTA>
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
