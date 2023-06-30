import styles from "../styles/Cell.module.css"
import {ReactNode, useMemo} from "react";

export type CellState = "EMPTY" | "EXACT" | "ALMOST" | "WRONG"

interface CellProps {
    value?: ReactNode,
    state: CellState,
    columnIndex: number,
}

const STATE_COLORS: Record<CellState, string> = {
    ALMOST: "var(--color-almost)",
    EMPTY: "transparent",
    EXACT: "var(--color-exact)",
    WRONG: "var(--color-wrong)"
}


export function Cell({value, state, columnIndex}: CellProps) {

    const hasValue = useMemo(() => Boolean(value), [value]);

    return <p
        className={`${styles.cell} ${hasValue && styles.hasValue}`}
        style={{
            background: STATE_COLORS[state],
            borderColor: state !== "EMPTY" ? "transparent" : "var(--color-dark)",
            transitionDelay: `${.1 * columnIndex}s`
        }}>{value}</p>
}