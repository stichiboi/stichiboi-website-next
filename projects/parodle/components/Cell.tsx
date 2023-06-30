import styles from "../styles/Cell.module.css"
import {ReactNode, useMemo} from "react";

export enum CellState { "EMPTY", "WRONG", "ALMOST", "EXACT"}

interface CellProps {
  value?: ReactNode,
  state: CellState,
  columnIndex: number,
}

const STATE_COLORS: Record<CellState, string> = {
  [CellState.ALMOST]: "var(--color-almost)",
  [CellState.EMPTY]: "transparent",
  [CellState.EXACT]: "var(--color-exact)",
  [CellState.WRONG]: "var(--color-wrong)"
}


export function Cell({value, state, columnIndex}: CellProps) {

  const hasValue = useMemo(() => Boolean(value), [value]);

  return <p
    className={`${styles.cell} ${hasValue && styles.hasValue}`}
    style={{
      background: STATE_COLORS[state],
      borderColor: state !== CellState.EMPTY ? "transparent" : "var(--color-dark)",
      transitionDelay: `${.1 * columnIndex}s`
    }}>{value}</p>
}