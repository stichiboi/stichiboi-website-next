import { Stepper } from "../../common/stepper/Stepper";
import { DIFFICULTY } from "../types";
import { Toggle } from "../../common/toggle/Toggle";
import { HalfMoon, NavArrowLeft, NavArrowRight, SunLight } from "iconoir-react";
import styles from "../styles/Menu.module.css";
import { ButtonCTA } from "../../common/button/ButtonCTA";

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
          defaultValue={DIFFICULTY.Medium}
          max={DIFFICULTY.Hard}
          min={DIFFICULTY.Trivial}
          leftIcon={<NavArrowLeft/>}
          rightIcon={<NavArrowRight/>}
          displayValue={v => DIFFICULTY[v]}
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
