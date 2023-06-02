import React, { useContext, useEffect, useState } from "react";
import { Play } from 'iconoir-react';
import { ResultType } from "../types/types";
import SettingsContainer from "./SettingsContainer";
import Results from "./Results";
import Info from "./Info";
import { SettingsContext } from "./SettingsContext";
import styles from "../styles/Menu.module.css";
import Popup from "./Popup";

export const LOCAL_SCORE_KEY = 'reflexo-best-score';

export function getLocalScore() {
  const localSave = localStorage.getItem(LOCAL_SCORE_KEY);
  if (localSave) {
    return parseInt(localSave);
  }
}

interface MenuProps {
  running: boolean,
  onStart: () => void,
  results: ResultType[]
}

export function Menu({
  running,
  onStart,
  results
}: MenuProps) {

  const [localScore, setLocalScore] = useState<undefined | number>();
  const { numberOfTries } = useContext(SettingsContext);

  useEffect(() => {
    const score = getLocalScore();
    setLocalScore(score);
  }, []);

  return (
    <div className={`${styles.menu} ${running ? styles.hidden : ''}`}>
      {!running && results.length ?
        <Results results={results}/>
        :
        <Popup defaultToggled={true}>
          <strong>{"How to"}</strong>
          <p>
            {"The objective is to measure your eye-hand reaction time."}<br/>
            {"After you press play, wait for the green screen: click it as soon as it appears."}<br/>
            {`After ${numberOfTries} round${numberOfTries > 1 ? 's' : ''}, your average time will be calculated.`}<br/>
            {"Try it a couple of times to see if you can improve!"}
          </p>
        </Popup>
      }
      <button className={styles.start} onClick={onStart}>
        <Play/>
      </button>
      <footer className={styles.footer}>
        <SettingsContainer
          clearLocalScore={() => {
            localStorage.removeItem(LOCAL_SCORE_KEY);
            setLocalScore(undefined);
          }}
        />
        {localScore !== undefined ?
          <p>{`Best: ${localScore} ms`}</p> : ''
        }
        <Info/>
      </footer>
    </div>
  )
}