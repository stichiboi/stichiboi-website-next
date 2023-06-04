import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Cancel, Check, EditPencil, QuestionMark, Undo } from "iconoir-react";
import ActionButton from "./ActionButton";
import Grid from "./Grid";
import Cell from "./Cell";
import { checkValidity, getFreeCells, loop, visitDeps } from "../sudokuGenerator";
import styles from "../styles/Sudoku.module.css";
import EndPopup from "./EndPopup";

const HINT_PENALTY = 30000; // 30 sec
const CHECK_PENALTY = 30000; // 30 sec

interface SudokuProps {
  sudoku: ISudoku,
  onExit: () => unknown
}

export function Sudoku({ sudoku, onExit }: SudokuProps) {
  const [, setStartTime] = useState(0);
  const formatTimer = useCallback((timer: number) => {
    const date = new Date(timer);
    const m = date.getMinutes(), s = date.getSeconds();
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }, []);
  const root = useMemo(() => Math.floor(Math.sqrt(sudoku.solution.length)), [sudoku.solution]);
  const [timer, setTimer] = useState('--:--');
  const noteMode = useRef(false);
  const selected = useRef<ICoords>();
  const [isComplete, setIsComplete] = useState(false);
  const [timerId, setTimerId] = useState(0);
  const [numberCount, setNumberCount] = useState<Map<number, number>>(new Map<number, number>());


  const [_triggerCheck, _setTriggerCheck] = useState(0);
  const triggerCheck = useCallback(() => _setTriggerCheck(prev => ++prev), []);

  const [_triggerRender, _setTriggerRender] = useState(0);
  const triggerRender = useCallback(() => _setTriggerRender(prev => ++prev), []);

  const [_triggerNoteMode, _setTriggerNoteMode] = useState(0);
  const toggleNoteMode = useCallback(() => {
    noteMode.current = !noteMode.current;
    _setTriggerNoteMode(prev => ++prev);
  }, []);

  const actionWrapper = useCallback((callback: () => unknown, needsRender?: boolean) => {
    if (isComplete) return;
    callback();
    if (needsRender) {
      triggerRender();
    }
  }, [isComplete, triggerRender]);

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
  }, [actionWrapper, sudoku.puzzle, triggerCheck]);

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
  }, [actionWrapper, sudoku.puzzle]);

  const check = useCallback(() => {
    actionWrapper(() => {
      setStartTime(prev => prev - CHECK_PENALTY);
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
      setStartTime(prev => prev - HINT_PENALTY);
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
            selected.current = { x, y }
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
        contents={Array.from({ length: sudoku.solution.length })
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
          Array.from({ length: sudoku.solution.length })
            .map((_, gridIndex) => buildSubGrid(gridIndex))
        }
      />
    )
  }, [_triggerRender, buildSubGrid, root, sudoku.solution.length]);

  const controls = useMemo(() => {
    return (
      <Grid
        size={root}
        isSmall
        contents={Array.from({ length: sudoku.solution.length })
          .map((_, i) => {
            const missCount = sudoku.puzzle.length - (numberCount.get(i + 1) || 0);
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
  }, [sudoku, numberCount]);

  const noteModeButton = useMemo(() => {
    return (
      <ActionButton
        tooltip={"Toggle note mode"}
        onClick={toggleNoteMode}
        isToggled={noteMode.current}
      >
        <EditPencil/>
      </ActionButton>
    )
  }, [_triggerNoteMode]);

  useEffect(() => {
    setStartTime(Date.now() - sudoku.time);
    triggerRender();
    setIsComplete(false);
    selected.current = undefined;
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setStartTime(startTime => {
        sudoku.time = Date.now() - startTime;
        setTimer(formatTimer(sudoku.time));
        return startTime;
      });
    }, 500);
    setTimerId(id as unknown as number);
    return () => clearInterval(id);
  }, [sudoku]);

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
    if (isComplete) clearInterval(timerId);
  }, [isComplete]);

  useEffect(() => {
    try {
      const asBoard = Array.from({ length: sudoku.puzzle.length }).map(() => []) as Board;
      loop(((x, y) => {
        const value = sudoku.puzzle[y][x].value;
        if (!value) throw InvalidBoardError;
        asBoard[y][x] = value;
      }));
      const validity = checkValidity(asBoard, false);
      if (validity === SUDOKU_VALIDITY.Ok) setIsComplete(true);
    } catch (e) {
      //Incomplete
    }
  }, [_triggerCheck]);

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
        const { x, y } = location;
        switch (event.key) {
        case "ArrowUp":
          return { x, y: y - 1 < 0 ? sudoku.puzzle.length - 1 : y - 1 };
        case "ArrowDown":
          return { x, y: (y + 1) % sudoku.puzzle.length };
        case "ArrowLeft":
          return { y, x: x - 1 < 0 ? sudoku.puzzle.length - 1 : x - 1 };
        case "ArrowRight":
          return { y, x: (x + 1) % sudoku.puzzle.length };
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
  }, [erase, setNumber]);


  const recordNumberCount = useCallback((number: number, op = 1) => {
    //Wrapper to keep track of the number of digits in the sudoku
    setNumberCount(prev => {
      const newCount = new Map(prev);
      newCount.set(number, (newCount.get(number) || 0) + op);
      return newCount;
    });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <ActionButton tooltip={"Return to menu"} onClick={onExit}>
          <Cancel/>
        </ActionButton>
        <p>{timer}</p>
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
      <EndPopup onExit={onExit} isComplete={isComplete} timer={timer}/>
    </div>
  );
}