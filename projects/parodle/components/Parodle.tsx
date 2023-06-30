import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Cell, CellState} from "./Cell";
import Keyboard, {KeyboardReactInterface} from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import styles from "../styles/Parodle.module.css";
import {ButtonCTA} from "../../common/button/ButtonCTA";
import {useConfetti} from "../../common/confetti/useConfetti";

const MAX_GUESSES = 6;
const MAX_WORD_LENGTH = 5;

interface ParodleProps {
  words: string[]
}

type GameState = "RUNNING" | "SUCCESS" | "FAILED";

export function Parodle({words}: ParodleProps) {
  const throwConfetti = useConfetti();
  const keyboard = useRef<KeyboardReactInterface | null>(null);
  const [usedLetters, setUsedLetters] = useState<Map<string, CellState>>(new Map());

  const wordsSet = useMemo<Set<string>>(() => {
    return new Set(words)
  }, [words]);

  const getWord = useCallback(() => {
    const arr = Array.from(wordsSet);
    const index = Math.floor(Math.random() * arr.length);
    return arr[index].toUpperCase();
  }, [words]);

  const [currentWord, setCurrentWord] = useState(getWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("RUNNING");

  const rows = useMemo(() => {
    return Array.from({length: MAX_GUESSES}).map((_, i) => {
      let tempCurrWord = Array.from(currentWord);
      const cells = Array.from({length: MAX_WORD_LENGTH}).map((_, j) => {
        let value = guesses.at(i)?.at(j) || "";
        let state: CellState = "EMPTY";
        const valueIndex = tempCurrWord.indexOf(value)
        if (guesses.length > i + 1) {
          // validate only on previous guesses, not the current one
          if (value === tempCurrWord[j]) {
            state = "EXACT";
            tempCurrWord[j] = "_";
          } else if (valueIndex !== -1) {
            state = "ALMOST";
            // before unsetting, check if that character is not an EXACT match
            if (tempCurrWord[valueIndex] === guesses.at(i)?.at(valueIndex)) {
              state = "WRONG";
            } else {
              tempCurrWord[valueIndex] = "_";
            }
          } else {
            state = "WRONG";
          }
          setUsedLetters(prev => {
            const next = new Map(prev);
            if (next.get(value) !== "EXACT") {
              // the "EXACT" cell should not be overwritten by an "ALMOST"
              next.set(value, state);
            }
            return next;
          });
        }
        return <Cell key={`${i}-${j}`} value={value} state={state} columnIndex={j}/>
      });
      return <div className={styles.row}>{cells}</div>
    })
  }, [guesses]);


  useEffect(() => {
    const lastEnteredGuess = guesses.at(-2);
    if (lastEnteredGuess === currentWord) {
      setGameState("SUCCESS");
    } else if (guesses.length === MAX_GUESSES + 1) {
      setGameState("FAILED");
    }
  }, [guesses]);

  useEffect(() => {
    if (gameState === "SUCCESS") {
      throwConfetti();
    }
  }, [gameState]);

  const resetBoard = useCallback(() => {
    setGameState("RUNNING");
    setGuesses([]);
    setCurrentWord(getWord());
    setUsedLetters(new Map());
  }, []);

  const onInputChange = useCallback((input: string) => {
    setGuesses(prev => {
      const next = [...prev];
      next.pop();
      next.push(input);
      return next;
    });
  }, []);


  const onKeyReleased = useCallback((button: string) => {
    if (button === "{enter}") {
      const isCorrectLength = keyboard.current?.getInput().length === MAX_WORD_LENGTH;
      const isValidWord = wordsSet.has(keyboard.current?.getInput() || "__invalid__");

      if (isCorrectLength && isValidWord) {
        keyboard.current?.clearInput();
        setGuesses(prev => [...prev, ""]);
      } else {
        // rows[guesses.length - 1].props.className += styles.isInvalid;
      }

      if (gameState === "SUCCESS") {
        throwConfetti();
      }
    }
  }, [gameState, rows, guesses]);

  useEffect(() => {
    function keyPress(event: KeyboardEvent) {
      function normalize(key: string) {
        switch (key) {
          case "ENTER":
            return "{enter}";
          case "BACKSPACE":
            return "{backspace}"
          default:
            return key;
        }
      }

      const key = normalize(event.key.toUpperCase());
      if (keyboard.current) {
        keyboard.current?.handleButtonClicked(key);
      }
      if (key === "{enter}") {
        onKeyReleased(key);
      }
    }

    document.addEventListener("keyup", keyPress);
    return () => document.removeEventListener("keyup", keyPress)
  }, [keyboard.current]);


  const buttonThemes = useMemo(() => {
    const entries = Array.from(usedLetters.entries());

    function getButtons(targetState: CellState) {
      return entries
        .filter(([_, state]) => state === targetState)
        .map(([value]) => value)
        .join(" ");
    }

    const themes = [
      {
        class: styles.keyWrong,
        buttons: getButtons("WRONG")
      },
      {
        class: styles.keyAlmost,
        buttons: getButtons("ALMOST")
      },
      {
        class: styles.keyExact,
        buttons: getButtons("EXACT")
      }
    ];
    return themes.filter(({buttons}) => buttons.length);
  }, [usedLetters]);

  return (
    <main className={styles.container}>
      <div className={styles.rows}>
        {rows}
      </div>
      <div className={`${styles.playAgain} ${gameState !== "RUNNING" && styles.toggled}`}>
        {gameState === "FAILED" && <p className={styles.failed}>{currentWord}</p>}
        <ButtonCTA onClick={resetBoard}>
          {"Gioca ancora"}
        </ButtonCTA>
      </div>
      <Keyboard
        keyboardRef={r => keyboard.current = r}
        onChange={onInputChange}
        onKeyReleased={onKeyReleased}
        maxLength={MAX_WORD_LENGTH}
        layout={{
          default: [
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{enter} Z X C V B N M {backspace}",
          ]
        }}
        display={{
          "{enter}": "GO",
          "{backspace}": "⌫"
        }}
        buttonTheme={buttonThemes}
      />
    </main>
  )
}