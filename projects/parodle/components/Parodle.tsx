import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Cell, CellState} from "./Cell";
import Keyboard, {KeyboardReactInterface} from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import styles from "../styles/Parodle.module.css";
import {ButtonCTA} from "../../common/button/ButtonCTA";
import {useConfetti} from "../../common/confetti/useConfetti";
import Link from "next/link";
import {QuestionMark} from "iconoir-react"

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
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [gameState, setGameState] = useState<GameState>("RUNNING");

  const rows = useMemo(() => {
    return Array.from({length: MAX_GUESSES}).map((_, i) => {
      let tempCurrWord = Array.from(currentWord);
      const cells = Array.from({length: MAX_WORD_LENGTH}).map((_, j) => {
        let value = guesses.at(i)?.at(j) || "";
        let state: CellState = CellState.EMPTY;
        const valueIndex = tempCurrWord.indexOf(value)
        if (guesses.length > i + 1) {
          // validate only on previous guesses, not the current one
          if (value === tempCurrWord[j]) {
            state = CellState.EXACT;
            tempCurrWord[j] = "_";
          } else if (valueIndex !== -1) {
            state = CellState.ALMOST;
            // before unsetting, check if that character is not an EXACT match
            if (tempCurrWord[valueIndex] === guesses.at(i)?.at(valueIndex)) {
              state = CellState.WRONG;
            } else {
              tempCurrWord[valueIndex] = "_";
            }
          } else {
            state = CellState.WRONG;
          }
          setUsedLetters(prev => {
            const next = new Map(prev);
            // the state can only increase (wrong -> almost -> exact)
            if (state > (next.get(value) || 0)) {
              next.set(value, state);
            }
            return next;
          });
        }
        return <Cell key={`${value}-${j}`} value={value} state={state} columnIndex={j}/>
      });
      const isLastRow = i === guesses.length - 1;
      return (
        <div
          key={i}
          className={`${styles.row} ${isLastRow && invalidGuess ? styles.isInvalid : ""}`}
        >
          {cells}
        </div>
      );
    })
  }, [guesses, invalidGuess]);


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

      if (gameState === "SUCCESS") {
        throwConfetti();
      } else if (isCorrectLength && isValidWord) {
        keyboard.current?.clearInput();
        setGuesses(prev => [...prev, ""]);
      } else {
        setInvalidGuess(prev => {
          if (!prev) {
            // if multiple calls are triggered, the animation should not be stopped midway
            setTimeout(() => setInvalidGuess(false), 200);
          }
          return true;
        });
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
        buttons: getButtons(CellState.WRONG)
      },
      {
        class: styles.keyAlmost,
        buttons: getButtons(CellState.ALMOST)
      },
      {
        class: styles.keyExact,
        buttons: getButtons(CellState.EXACT)
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
        <div className={styles.endGameButtons}>
          <ButtonCTA onClick={resetBoard}>
            {"Gioca ancora"}
          </ButtonCTA>
          <Link
            title={"Ma che significa?"}
            target={"_blank"}
            href={`https://www.google.com/search?q=${currentWord}+dizionario+significato`}
            className={styles.questionMark}
          >
            <QuestionMark/>
          </Link>
        </div>
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