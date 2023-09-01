import useSWR from "swr";
import {Parodle} from "./components/Parodle";
import LoadingScreen from "../../components/LoadingScreen";
import styles from "./styles/App.module.css";
import Logo from "../../public/stichiboi-logo.svg";
import Link from "next/link";
import {StatsPopup} from "./components/StatsPopup";
import {useStats} from "./useStats";
import {useState} from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function App() {
  const {data, error} = useSWR<{ words: string[] }>('/api/parodle/words', fetcher);
  const {stats, onWord, onGameEnd} = useStats();
  const [isRunning, setIsRunning] = useState(true);

  if (data) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.parodleLinks}>
            <StatsPopup
              label={<h1 className={styles.title}>{"Parodle"}</h1>}
              stats={stats}
              isOpen={!isRunning}/>
          </div>
          <Link href={"/"} passHref>
            <Logo/>
          </Link>
        </header>
        {data && !error && <Parodle
          words={data.words}
          onWord={onWord}
          onGameEnd={onGameEnd}
          onGameStateChange={(gameState) => {
            setIsRunning(gameState === "RUNNING");
          }}
        />}
        {error &&
          <div>
            <p>{"Failed to load"}</p>
            {error}
          </div>}

      </div>
    );
  }

  return (
    <LoadingScreen isLoading={!data}/>
  );
}