import {Popup} from "../../common/popup/Popup";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Stats} from "../useStats";
import styles from "../styles/StatsPopup.module.css";

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

  const frequentWords = useMemo(() => {
    const asList = Array
      .from(stats.wordFrequency.entries())
      .sort((a, b) => Math.sign(b[1] - a[1]));
    const best = asList.slice(0, 3);
    return (
      <section className={styles.frequentWords}>
        <em>{"Parole piu frequenti"}</em>
        {best.map(([word, count]) => {
          return (
            <div key={word} className={styles.frequency}>
              <p>{word}</p>
              <p>{count}</p>
            </div>
          )
        })}
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
        <h2>
          {stats.totalSuccess} / {stats.totalPlays}
        </h2>
        <em>{"Volte giocate"}</em>
      </div>
      {frequentWords}
    </Popup>
  )
}