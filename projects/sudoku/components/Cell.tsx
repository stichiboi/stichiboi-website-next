import React, { useCallback } from "react";
import { CELL_HIGHLIGHT, ICell } from "../types";
import ActionButton from "./ActionButton";
import styles from "../styles/Cell.module.css";

export default function Cell({
  cell,
  onClick,
  highlight,
  forceNotes
}: {
  cell: ICell,
  onClick: () => unknown,
  highlight: CELL_HIGHLIGHT,
  forceNotes?: boolean
}) {

  const formatNotes = useCallback((notes: Set<number>) => {
    return Array.from(notes)
      .sort((a, b) => a < b ? -1 : 1)
      .map(n => (
        <p key={n}>{n}</p>
      ));
  }, []);

  const classes = [
    cell.isFixed && styles.fixed,
  ];

  switch (highlight) {
  case CELL_HIGHLIGHT.Soft:
    classes.push(styles.highlightSoft);
    break;
  case CELL_HIGHLIGHT.Error:
    classes.push(styles.highlightError);
    break;
  default:
    break;
  }

  return (
    <ActionButton
      onClick={onClick}
      fill
      isToggled={highlight === CELL_HIGHLIGHT.Main}
      className={classes.join(" ")}
    >
      <p>{cell.value || null}</p>
      {forceNotes || !cell.value ? <div className={styles.cellNotes}>{formatNotes(cell.notes)}</div> : null}
    </ActionButton>
  );
}