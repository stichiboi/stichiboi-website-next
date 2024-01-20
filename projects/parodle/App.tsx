import useSWR from "swr";
import {Parodle} from "./components/Parodle";
import styles from "./styles/App.module.css";
import Logo from "../../public/stichiboi-logo.svg";
import Link from "next/link";
import {StatsPopup} from "./components/StatsPopup";
import {useStats} from "./useStats";
import {useEffect} from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AppProps {
  lockLoading: (v: boolean) => unknown
}

export function App({lockLoading}: AppProps) {
  const {data, error} = useSWR<{ words: string[] }>('/api/parodle/words', fetcher);
  const {stats, onWord, onGameEnd} = useStats();
  useEffect(() => {
    if (data) {
      lockLoading(false);
    } else {
      lockLoading(true);
    }
  }, []);

  if (data) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.parodleLinks}>
            <h1 className={styles.title}>{"Parodle"}</h1>
            <StatsPopup stats={stats}/>
          </div>
          <Link href={"/"} passHref>
            <Logo/>
          </Link>
        </header>
        {data && !error && <Parodle
          words={data.words}
          onWord={onWord}
          onGameEnd={onGameEnd}
        />}
        {error &&
          <div>
            <p>{"Failed to load"}</p>
            {error}
          </div>}

      </div>
    );
  }
  return <p>{"Sto ancora caricando le parole..."}</p>
}