import useSWR from "swr";
import {Parodle} from "./components/Parodle";
import LoadingScreen from "../../components/LoadingScreen";
import styles from "./styles/App.module.css";
import Logo from "../../public/stichiboi-logo.svg";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function App() {
  const {data, error} = useSWR<{ words: string[] }>('/api/parodle/words', fetcher);

  if (error) return <div>Failed to load</div>;

  if (data) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>{"Parodle"}</h1>
          <Link href={"/"}>
            <Logo/>
          </Link>
        </header>
        <Parodle words={data.words}/>
      </div>
    );
  }

  return (
    <LoadingScreen isLoading={!data}/>
  );
}