import {useMemo, useState} from "react";
import {Stats} from "../useStats";
import styles from "../styles/StatsPopup.module.css";
import {StatNumber} from "./StatNumber";
import {GraphUp, Xmark} from "iconoir-react";
import {ProgressBar} from "../../common/progressbar/ProgressBar";
import ActionButton from "../../sudoku/components/ActionButton";

interface StatsPopupProps {
  stats: Stats,
}

export function StatsPopup({stats}: StatsPopupProps) {
  const attempts = useMemo(() => {
    return (
      <section className={styles.frequentWords}>
        <em>{"Numero di tentativi"}</em>
        {stats.successAttempts.map((attemptCount, index) => {
          const percentage = attemptCount / stats.totalSuccess;
          return <ProgressBar
            key={index}
            label={index + 1}
            absoluteValue={attemptCount}
            percentage={percentage}
          />;
        })}
      </section>
    );
  }, [stats.successAttempts]);

  const frequentWords = useMemo(() => {
    const asList = Array
      .from(stats.wordFrequency.entries())
      .sort((a, b) => Math.sign(b[1] - a[1]));
    const best = asList.slice(0, 3);
    return (
      <section className={styles.frequentWords}>
        <em>{"Parole piu frequenti"}</em>
        {best.length ? best.map(([word, count]) => {
          return (
            <div key={word} className={styles.frequency}>
              <p>{word}</p>
              <p className={styles.counter}>{count}</p>
            </div>
          )
        }) : <p>{"Ancora nessun tentativo"}</p>}
      </section>
    )
  }, [stats.wordFrequency]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.container}>
      <ActionButton onClick={() => setIsOpen(prev => !prev)}>
        <GraphUp/>
      </ActionButton>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
        <header className={styles.header}>
          <h2 className={styles.title}>{"Statistiche"}</h2>
          <ActionButton onClick={() => setIsOpen(false)}>
            <Xmark/>
          </ActionButton>
        </header>
        <div className={styles.count}>
          <div className={styles.stats}>
            <StatNumber label={"Partite"} value={stats.totalPlays}/>
            <StatNumber
              label={"Vittorie"}
              value={
                `${parseFloat((stats.totalSuccess / stats.totalPlays * 100).toFixed())}%`
              }
            />
          </div>
        </div>
        {attempts}
        {frequentWords}
      </div>
    </section>
  );
}