import React, { useCallback, useEffect, useState } from "react";
import { getLocalScore, LOCAL_SCORE_KEY } from "./Menu";
import { ResultType } from "../types/types";
import menuStyles from "../styles/Menu.module.css";
import styles from "../styles/Results.module.css";

export default function Results({ results }: { results: ResultType[] }) {

  const calculateAverage = useCallback(() => {
    if (results.length === 0) return 0;
    let tot = 0;
    for (let r of results) {
      if (typeof r === 'number') tot += r;
      //If there's an invalid result, then the average is invalid
      else return 0;
    }
    return Math.round(tot / results.length);
  }, [results]);

  const [average, setAverage] = useState(calculateAverage());
  const [isBest, setIsBest] = useState(false);
  useEffect(() => {
    setAverage(calculateAverage());
  }, [calculateAverage, results]);

  useEffect(() => {
    if (average) {
      const prevScore = getLocalScore() || Infinity;
      if (average < prevScore) {
        setIsBest(true);
      } else {
        setIsBest(false);
      }
      localStorage.setItem(LOCAL_SCORE_KEY, Math.min(prevScore, average).toString());
    }
  }, [average]);

  function formatResultType(r: ResultType) {
    return typeof r === 'number' ? `${r} ms` : r;
  }

  return (
    <div className={menuStyles.tutorial}>
      <section className={styles.container}>
        <strong>{"Results"}</strong>
        <div className={styles.content}>
          {results.length ? results.map((r, ind) => (
            <p key={ind}>{formatResultType(r)}</p>
          )) : <em>{"No results yet"}</em>}
        </div>
      </section>
      <section className={styles.container}>
        <strong>{"Average"}</strong>
        {average ?
          <p>{formatResultType(average)}</p>
          : <em>{'Invalid result'}</em>
        }
        {isBest ? <em>{"New best!"}</em> : ''}
      </section>
    </div>
  )
}