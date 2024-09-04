import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
  Board,
  CELL_HIGHLIGHT,
  DIFFICULTY,
  ICell,
  ICoords,
  InvalidBoardError,
  ISudoku,
  SUDOKU_VALIDITY
} from "../types";
import {Cancel, Check, EditPencil, QuestionMark, Undo} from "iconoir-react";
import ActionButton from "./ActionButton";
import Grid from "./Grid";
import Cell from "./Cell";
import {checkValidity, getFreeCells, loop, visitDeps} from "../sudokuGenerator";
import styles from "../styles/Sudoku.module.css";
import EndPopup from "../../common/popup/EndPopup";
import {useStopwatch} from "react-timer-hook";

const HINT_PENALTY_SECONDS = 30;
const CHECK_PENALTY_SECONDS = 30;

interface SudokuProps {
  sudoku: ISudoku,
  onExit: () => unknown
}

export function Sudoku({sudoku, onExit}: SudokuProps) {
  const {minutes, seconds, pause} = useStopwatch({autoStart: true});
  const [timePenalties, setTimePenalties] = useState(0);
  const timerDisplay = useMemo(() => {
    const totalSeconds = minutes * 60 + seconds + timePenalties;
    const minutesWithPenalties = Math.floor(totalSeconds / 60);
    const secondsWithPenalties = totalSeconds - minutesWithPenalties * 60;

    function asString(v: number) {
      return v.toString().padStart(2, "0");
    }

    return `${asString(minutesWithPenalties)}:${asString(secondsWithPenalties)}`;
  }, [minutes, seconds, timePenalties]);

  const root = useMemo(() => Math.floor(Math.sqrt(sudoku.solution.length)), [sudoku.solution]);
  const noteMode = useRef(false);
  const selected = useRef<ICoords>();
  const [isComplete, setIsComplete] = useState(false);
  const [numberCount, setNumberCount] = useState<Map<number, number>>(new Map<number, number>());

  const [_triggerCheck, _setTriggerCheck] = useState(1);
  const triggerCheck = useCallback(() => _setTriggerCheck(prev => ++prev), []);

  const [_triggerRender, _setTriggerRender] = useState(0);
  const triggerRender = useCallback(() => _setTriggerRender(prev => ++prev), []);

  const [_triggerNoteMode, _setTriggerNoteMode] = useState(1);
  const toggleNoteMode = useCallback(() => {
    noteMode.current = !noteMode.current;
    _setTriggerNoteMode(prev => ++prev);
  }, []);

  // any action might require to rerender the sudoku, so this is a utility function to manage that
  const actionWrapper = useCallback((callback: () => unknown, needsRender?: boolean) => {
    if (isComplete) return;
    callback();
    if (needsRender) {
      triggerRender();
    }
  }, [isComplete, triggerRender]);

  const recordNumberCount = useCallback((number: number, op = 1) => {
    // wrapper to keep track of the number of inserted digits in the sudoku
    setNumberCount(prev => {
      const newCount = new Map(prev);
      newCount.set(number, (newCount.get(number) || 0) + op);
      return newCount;
    });
  }, []);

  const setNumber = useCallback((number: number, coords: ICoords | undefined, isHint?: boolean) => {
    actionWrapper(() => {
      if (!coords) return;
      const cell = sudoku.puzzle[coords.y][coords.x];
      if (cell.isFixed) return;
      if (noteMode.current && !isHint) {
        if (cell.notes.has(number)) cell.notes.delete(number);
        else cell.notes.add(number);
      } else {
        if (number !== cell.value) {
          recordNumberCount(cell.value, -1);
          recordNumberCount(number);
          cell.isError = false;
          cell.value = number;
          //Remove notes from dependent cells
          visitDeps(coords.x, coords.y, ((tx, ty) => {
            sudoku.puzzle[ty][tx].notes.delete(number);
          }));
          triggerCheck();
        }
        if (isHint) {
          cell.isFixed = true;
        }
      }
    }, true);
  }, [actionWrapper, recordNumberCount, sudoku.puzzle, triggerCheck]);

  const erase = useCallback((coords: ICoords | undefined) => {
    actionWrapper(() => {
      if (!coords) return;
      const cell = sudoku.puzzle[coords.y][coords.x];
      if (cell.isFixed) return;
      recordNumberCount(cell.value, -1);
      cell.value = 0;
      cell.notes.clear();
      cell.isError = false;
    }, true);
  }, [actionWrapper, recordNumberCount, sudoku.puzzle]);

  const check = useCallback(() => {
    actionWrapper(() => {
      setTimePenalties(prev => prev + CHECK_PENALTY_SECONDS);
      loop(((x, y) => {
        const cell = sudoku.puzzle[y][x];
        if (cell.value && cell.value !== sudoku.solution[y][x]) {
          cell.isError = true;
        }
      }));
    }, true);
  }, [actionWrapper, sudoku.puzzle, sudoku.solution]);

  const giveHint = useCallback((giveAll?: boolean) => {
    actionWrapper(() => {
      setTimePenalties(prev => prev + HINT_PENALTY_SECONDS);
      const freeCells = getFreeCells(sudoku.puzzle);
      if (giveAll) {
        for (const c of freeCells) {
          setNumber(sudoku.solution[c.y][c.x], c);
          sudoku.puzzle[c.y][c.x].isFixed = true;
        }
      } else if (freeCells.length) {
        const ind = Math.floor(Math.random() * freeCells.length);
        const coords = freeCells[ind];
        selected.current = coords;
        setNumber(sudoku.solution[coords.y][coords.x], coords, true);
      }
    });
  }, [actionWrapper, setNumber, sudoku.puzzle, sudoku.solution]);

  const getHighlight = useCallback((x: number, y: number) => {
    const cell = sudoku.puzzle[y][x];
    if (cell.isError) {
      return CELL_HIGHLIGHT.Error;
    }
    if (!selected.current) {
      return CELL_HIGHLIGHT.None;
    }
    const sx = selected.current.x, sy = selected.current.y;
    // is in row or column (or both, which means it's the selected cell, in which case Soft + Soft becomes Main)
    let high: CELL_HIGHLIGHT =
      (x === sx ? CELL_HIGHLIGHT.Soft : CELL_HIGHLIGHT.None)
      + (y === sy ? CELL_HIGHLIGHT.Soft : CELL_HIGHLIGHT.None);
    if (high) {
      return high;
    }
    // same number
    const currValue = cell.value;
    if (currValue && sudoku.puzzle[sy][sx].value === currValue) {
      return CELL_HIGHLIGHT.Soft;
    }
    // if in same block
    const bx = Math.floor(x / root), by = Math.floor(y / root);
    const bsx = Math.floor(sx / root), bsy = Math.floor(sy / root);
    if (bx === bsx && by === bsy) {
      return CELL_HIGHLIGHT.Soft;
    }
    return CELL_HIGHLIGHT.None;
  }, [root, sudoku.puzzle]);

  const buildCell = useCallback((gridIndex: number, cellIndex: number) => {
    const y = Math.floor(gridIndex / root) * root + Math.floor(cellIndex / root);
    const x = cellIndex % root + gridIndex % root * root;
    return (
      <Cell
        key={cellIndex}
        cell={sudoku.puzzle[y][x]}
        highlight={getHighlight(x, y)}
        onClick={() => {
          if (selected.current?.x === x && selected.current?.y === y) {
            selected.current = undefined
          } else {
            selected.current = {x, y}
          }
          triggerRender();
        }}
      />);
  }, [getHighlight, root, sudoku.puzzle, triggerRender]);

  const buildSubGrid = useCallback((gridIndex: number) => {
    return (
      <Grid
        key={gridIndex}
        size={root}
        contents={Array.from({length: sudoku.solution.length})
          .map((_, cellIndex) => buildCell(gridIndex, cellIndex))
        }
      />
    );
  }, [buildCell, root, sudoku.solution.length]);

  const board = useMemo(() => {
    if (!_triggerRender) return null;
    return (
      <Grid
        size={root}
        contents={
          Array.from({length: sudoku.solution.length})
            .map((_, gridIndex) => buildSubGrid(gridIndex))
        }
        className={noteMode.current ? styles.gridInNoteMode : ""}
      />
    )
  }, [_triggerRender, buildSubGrid, root, sudoku.solution.length, noteMode.current]);

  const controls = useMemo(() => {
    const length = sudoku.solution.length;
    return (
      <Grid
        size={root}
        isSmall
        contents={Array.from({length})
          .map((_, i) => {
            const missCount = length - (numberCount.get(i + 1) || 0);
            const cell: ICell = {
              value: i + 1,
              notes: new Set([missCount]),
              isFixed: true,
              isError: false
            }
            return (
              <Cell
                key={i}
                cell={cell}
                onClick={() => setNumber(i + 1, selected.current)}
                highlight={CELL_HIGHLIGHT.None}
                forceNotes
              />
            );
          })}/>
    )
  }, [sudoku.solution.length, root, numberCount, setNumber]);

  const noteModeButton = useMemo(() => {
    if (!_triggerNoteMode) return null;
    return (
      <ActionButton
        tooltip={"Toggle note mode"}
        onClick={toggleNoteMode}
        isToggled={noteMode.current}
        className={styles.gridInNoteMode}
      >
        <EditPencil/>
      </ActionButton>
    )
  }, [_triggerNoteMode, toggleNoteMode]);

  useEffect(() => {
    triggerRender();
    selected.current = undefined;
  }, [sudoku, triggerRender]);

  useEffect(() => {
    const temp = new Map<number, number>();
    loop(((x, y) => {
      const value = sudoku.puzzle[y][x].value;
      // increase the value by 1
      temp.set(value, (temp.get(value) || 0) + 1)
    }));
    setNumberCount(temp);
  }, [sudoku]);

  useEffect(() => {
    if (isComplete) {
      pause();
    }
  }, [isComplete, pause]);

  useEffect(() => {
    if (!_triggerCheck) return;
    try {
      const asBoard: Board = Array.from({length: sudoku.puzzle.length}).map(() => []);
      loop(((x, y) => {
        const value = sudoku.puzzle[y][x].value;
        if (!value) throw InvalidBoardError;
        asBoard[y][x] = value;
      }));
      const validity = checkValidity(asBoard, false);
      if (validity === SUDOKU_VALIDITY.Ok) setIsComplete(true);
    } catch (e) {
      // incomplete
    }
  }, [_triggerCheck, sudoku.puzzle]);

  //Event listeners
  useEffect(() => {
    function keyboardEventListener(event: KeyboardEvent) {
      event.preventDefault();
      const location = selected.current;
      if (location) {
        const number = parseInt(event.key);
        if (number) {
          setNumber(number, location);
        } else if (number === 0 || event.key === 'Backspace' || event.key === 'Clear' || event.key === 'Delete') {
          erase(location);
        }
      }
    }

    function movementEventListener(event: KeyboardEvent) {
      function getNewLocation(location: ICoords): ICoords | undefined {
        const length = sudoku.puzzle.length;
        const {x, y} = location;
        switch (event.key) {
          case "ArrowUp":
            return {x, y: y - 1 < 0 ? length - 1 : y - 1};
          case "ArrowDown":
            return {x, y: (y + 1) % length};
          case "ArrowLeft":
            return {y, x: x - 1 < 0 ? length - 1 : x - 1};
          case "ArrowRight":
            return {y, x: (x + 1) % length};
        }
      }

      if (event.key.indexOf('Arrow') !== -1 && selected.current) {
        selected.current = getNewLocation(selected.current);
        triggerRender();
      }
      if (event.key === 'n' || event.key === 'Enter' || event.key === 'Return') {
        event.preventDefault();
        toggleNoteMode();
      }
    }

    document.addEventListener('keyup', keyboardEventListener);
    document.addEventListener('keydown', movementEventListener);
    return () => {
      document.removeEventListener('keyup', keyboardEventListener);
      document.removeEventListener('keydown', movementEventListener);
    }
  }, [erase, setNumber, sudoku.puzzle.length, toggleNoteMode, triggerRender]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <ActionButton tooltip={"Return to menu"} onClick={onExit}>
          <Cancel/>
        </ActionButton>
        <p>{timerDisplay}</p>
        <h3 className={styles.difficulty}>{DIFFICULTY[sudoku.difficulty]}</h3>
      </header>
      {board}
      <section className={styles.actions}>
        <div className={styles.actionGroup}>
          {noteModeButton}
          <ActionButton tooltip={"Clear cell"} onClick={() => erase(selected.current)}>
            <Undo/>
          </ActionButton>
        </div>
        {controls}
        <div className={styles.actionGroup}>
          <ActionButton tooltip={"Check for mistakes"} onClick={check}>
            <Check/>
          </ActionButton>
          <ActionButton tooltip={"Ask for a hint"} onClick={() => giveHint(false)}>
            <QuestionMark/>
          </ActionButton>
        </div>
      </section>
      <EndPopup onExit={onExit} exitCta={"Menu"} isVisible={isComplete}>
        {`Completed in ${timerDisplay}!`}
      </EndPopup>
    </div>
  );
}