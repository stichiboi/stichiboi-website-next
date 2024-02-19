import {useEffect, useRef, useState} from "react";
import {Simulation} from "./Simulation";
import {Settings} from "./Settings";
import Link from "next/link";
import Logo from "../../public/stichiboi-logo.svg";
import styles from "./app.module.css";
import {Grid} from "./elements/Grid";
import {GridData} from "../../pages/api/stichisand/grid";
import {SaveForm} from "./SaveForm";

export const API_PATH = "/api/stichisand/grid";

interface AppProps {
    lockLoading: (v: boolean) => unknown
}

export function App({lockLoading}: AppProps) {

  const [brushRadius, setBrushRadius] = useState(3);
  const [isErase, setIsErase] = useState(false);
  const [material, setMaterial] = useState("sand");
  const [pause, setPause] = useState(false);
  const grid = useRef<Grid>(new Grid());
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState<string>("Untitled");


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gridId = urlParams.get("id");
    if (!gridId) {
      return;
    }
    lockLoading(true);
    setIsLoading(true);
    fetch(`${API_PATH}?id=${gridId}`)
      .then(res => res.json() as unknown as GridData)
      .then(data => {
        grid.current.decode(data.grid, data.width, data.height);
        // pause by default when loading
        setPause(true);
        setName(data.name);
      })
      .finally(() => {
        setIsLoading(false);
        lockLoading(false);
      });
  }, [lockLoading]);


  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <div className={styles.buttonGroup}>
          <Settings brushSize={brushRadius} onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase}
            material={material} onMaterialChange={setMaterial} onPause={setPause}/>
          <SaveForm grid={grid} name={name}/>
        </div>
        <Link href={"/"} passHref>
          <Logo/>
        </Link>
      </header>
      <Simulation grid={grid} isErase={isErase} brushRadius={brushRadius} material={material} pause={pause}/>
    </div>
  )
}