import React, {useContext, useEffect, useState} from "react";
import {Play} from 'iconoir-react';
import {ResultType} from "../types";
import SettingsContainer from "./SettingsContainer";
import Results from "./Results";
import {SettingsContext} from "./SettingsContext";
import styles from "../styles/Menu.module.css";
import Link from "next/link";
import Logo from "../../../public/stichiboi-logo.svg";

export const LOCAL_SCORE_KEY = 'reflexo-best-score';

export function getLocalScore() {
  const localSave = localStorage.getItem(LOCAL_SCORE_KEY);
  if (localSave) {
    return parseInt(localSave);
  }
}

interface MenuProps {
  isRunning: boolean,
  onStart: () => void,
  results: ResultType[]
}

export function Menu({
  isRunning,
  onStart,
  results
}: MenuProps) {

  const [localScore, setLocalScore] = useState<number>();
  const {numberOfTries} = useContext(SettingsContext);

  useEffect(() => {
    const score = getLocalScore();
    setLocalScore(score);
  }, [isRunning]);

  return (
    <div className={`${styles.menu} ${isRunning ? styles.hidden : ""}`}>
      <header>
        {localScore !== undefined ?
          <p title={"Your best score"}>{`⭐ ${localScore} ms`}</p> : <em>{"No best score yet"}</em>
        }
      </header>
      <main className={styles.content}>
        <Results results={results}/>
        <button className={styles.start} onClick={onStart} title={"Start playing"}>
          <Play width={72} height={72}/>
        </button>
        <div className={styles.tutorial}>
          <strong>{"How to play"}</strong>
          <p>
            {"The objective is to measure your eye-hand reaction time."}<br/>
            {"After you press play, wait for the green screen: click it as soon as it appears."}<br/>
            {`After ${numberOfTries} round${numberOfTries > 1 ? 's' : ''}, your average time will be calculated.`}<br/>
            {"Try it a couple of times to see if you can improve!"}
          </p>
        </div>
      </main>
      <footer className={styles.footer}>
        <SettingsContainer
          clearLocalScore={() => {
            localStorage.removeItem(LOCAL_SCORE_KEY);
            setLocalScore(undefined);
          }}
        />
        <Link href={"/"} passHref>
          <Logo/>
        </Link>
      </footer>
    </div>
  )
}