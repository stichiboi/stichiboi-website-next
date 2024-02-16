import {useCallback, useEffect, useRef, useState} from "react";
import {Simulation} from "./Simulation";
import {Settings} from "./Settings";
import Link from "next/link";
import Logo from "../../public/stichiboi-logo.svg";
import styles from "./app.module.css";
import {Grid} from "./elements/Grid";
import {ShareIos} from "iconoir-react";
import {GridData} from "../../pages/api/stichisand/grid";

const API_PATH = "/api/stichisand/grid";

interface AppProps {
    lockLoading: (v: boolean) => unknown
}

export function App({lockLoading}: AppProps) {

    const [brushRadius, setBrushRadius] = useState(3);
    const [isErase, setIsErase] = useState(false);
    const [material, setMaterial] = useState("sand");
    const [pause, setPause] = useState(false);
    const [gridId, setGridId] = useState("");
    const grid = useRef<Grid>(new Grid());
    const [isLoading, setIsLoading] = useState(false);

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
            .then(data => grid.current.decode(data.grid, data.width, data.height))
            .finally(() => {
                setIsLoading(false);
                lockLoading(false);
            });
    }, []);

    const onShare = useCallback(async () => {
        const body: GridData = {
            _id: gridId,
            grid: grid.current.encode(),
            name: "My beautiful design",
            creatorName: "Stichiboi",
            version: "0.0.1",
            width: grid.current.width,
            height: grid.current.height,
        }
        const res: { id: string } = await fetch(API_PATH, {
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => res.json());
        setGridId(res.id);
    }, [gridId, setGridId]);

    useEffect(() => {
        if (gridId) {
            const url = new URL(window.location.href);
            url.searchParams.set("id", gridId);
            window.history.replaceState({}, '', url.href);
        }
    }, [gridId]);

    if (isLoading) {
        return <p>Loading</p>
    }

    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <div className={styles.buttonGroup}>
                    <Settings onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase}
                              onMaterialChange={setMaterial} onPause={setPause}/>
                    <button onClick={onShare}>
                        <ShareIos/>
                    </button>
                </div>
                <Link href={"/"} passHref>
                    <Logo/>
                </Link>
            </header>
            <Simulation grid={grid} isErase={isErase} brushRadius={brushRadius} material={material} pause={pause}/>
        </div>
    )
}