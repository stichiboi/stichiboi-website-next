import {Popup} from "../../common/popup/Popup";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Stats} from "../useStats";
import styles from "../styles/StatsPopup.module.css";
import {StatNumber} from "./StatNumber";

interface StatsPopupProps {
  stats: Stats,
  isOpen: boolean,
  label: ReactNode
}

export function StatsPopup({stats, isOpen, label}: StatsPopupProps) {

  const [triggerOpen, setTriggerOpen] = useState(0);
  const [triggerClose, setTriggerClose] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTriggerOpen(prev => prev + 1);
    } else {
      setTriggerClose(prev => prev + 1);
    }
  }, [isOpen]);

  const attempts = useMemo(() => {
    return (
      <section className={styles.frequentWords}>
        <em>{"Numero di tentativi"}</em>
        {stats.successAttempts.map((attemptCount, index) => {
          return (
            <div className={styles.frequency}>
              <p>{index + 1}</p>
              <p className={styles.counter}>{attemptCount}</p>
            </div>
          )
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

  return (
    <Popup
      label={label}
      labelTooltip={"Statistiche"}
      triggerOpen={triggerOpen}
      triggerClose={triggerClose}
      placement={"bottom-start"}
      containerClassName={styles.container}
    >
      <div className={styles.count}>
        <div className={styles.stats}>
          <StatNumber label={"Partite"} value={stats.totalPlays}/>
          <StatNumber
            label={"Vittorie"}
            value={
              `${parseFloat((stats.totalSuccess / stats.totalPlays).toFixed(2)) * 100}%`
            }
          />
        </div>
      </div>
      {attempts}
      {frequentWords}
    </Popup>
  )
}