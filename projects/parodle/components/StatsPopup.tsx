import {useCallback, useMemo, useState} from "react";
import {Stats} from "../useStats";
import styles from "../styles/StatsPopup.module.css";
import {StatNumber} from "./StatNumber";
import {GraphUp, Xmark} from "iconoir-react";
import {ProgressBar} from "../../common/progressbar/ProgressBar";
import ActionButton from "../../sudoku/components/ActionButton";
import {Title} from "../../../components/generic/Title";
import {ButtonCTA} from "../../common/button/ButtonCTA";

interface StatsPopupProps {
  stats: Stats,
  resetStats: () => unknown
}

export function StatsPopup({stats, resetStats}: StatsPopupProps) {
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
            barClassName={styles.progressBar}
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
  const [triggerAnimation, setTriggerAnimation] = useState(0);

  const openOverlay = useCallback(() => {
    setIsOpen(true);
    setTriggerAnimation(prev => ++prev);
  }, []);

  return (
    <section className={styles.container}>
      <ActionButton onClick={openOverlay}>
        <GraphUp/>
      </ActionButton>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
        <header className={styles.header}>
          <Title text={"Statistiche"}/>
          <ActionButton onClick={() => setIsOpen(false)}>
            <Xmark/>
          </ActionButton>
        </header>
        <div className={styles.count}>
          <div className={styles.stats}>
            <StatNumber
              triggerAnimation={triggerAnimation}
              label={"Partite"}
              value={stats.totalPlays || 0}
              delay={250}
            />
            <StatNumber
              label={"Vittorie"}
              triggerAnimation={triggerAnimation}
              appendix={<p>%</p>}
              value={
                parseFloat((stats.totalSuccess / Math.max(1, stats.totalPlays) * 100).toFixed()) || 0
              }
              delay={250}
            />
          </div>
        </div>
        {attempts}
        {frequentWords}
        <ButtonCTA onClick={resetStats}>{"Reset"}</ButtonCTA>
      </div>
    </section>
  );
}