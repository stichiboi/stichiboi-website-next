import {Popup} from "../../common/popup/Popup";
import {useMemo} from "react";
import {Stats} from "../useStats";
import styles from "../styles/StatsPopup.module.css";
import {StatNumber} from "./StatNumber";
import {GraphUp} from "iconoir-react";

interface StatsPopupProps {
  stats: Stats,
}

export function StatsPopup({stats}: StatsPopupProps) {
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
      label={<GraphUp/>}
      labelClassName={styles.popover}
      labelTooltip={"Statistiche"}
      placement={"bottom-start"}
      offsetOptions={0}
      containerClassName={styles.container}
    >
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
    </Popup>
  )
}