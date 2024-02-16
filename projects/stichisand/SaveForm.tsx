import {Popup} from "../common/popup/Popup";
import {useStateLocalStorage} from "../common/hooks/useStateLocalStorage";
import {ShareIos, Copy} from "iconoir-react";
import {MutableRefObject, useCallback, useEffect, useState} from "react";
import {GridData} from "../../pages/api/stichisand/grid";
import {API_PATH} from "./App";
import {Grid} from "./elements/Grid";
import {ButtonCTA} from "../common/button/ButtonCTA";
import styles from "./saveForm.module.css";


const GRID_VERSION = "0.0.1";

interface SaveFormProps {
    grid: MutableRefObject<Grid>,
    name: string
}

export function SaveForm({grid, name}: SaveFormProps) {

    const [creatorName, setCreatorName] = useStateLocalStorage<string>("Willy Wonka", "stichisand-creator-name");
    const [gridId, setGridId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [gridName, setGridName] = useState(name);

    const onShare = useCallback(() => {
        if (isLoading) {
            return;
        }
        const body: GridData = {
            id: gridId,
            grid: grid.current.encode(),
            name: gridName,
            creatorName,
            version: GRID_VERSION,
            width: grid.current.width,
            height: grid.current.height,
        }
        setIsLoading(true);
        fetch(API_PATH, {
            method: "POST",
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => setGridId(res.id))
            .finally(() => setIsLoading(false));
    }, [gridId, setGridId, isLoading, gridName, creatorName]);

    useEffect(() => {
        if (gridId) {
            const url = new URL(window.location.href);
            url.searchParams.set("id", gridId);
            window.history.replaceState({}, '', url.href);
        }
    }, [gridId]);

    return (
        <>
            <Popup label={<ShareIos/>} containerClassName={styles.popup}>
                <div className={styles.inputGroup}>
                    <label htmlFor={"creator-name"} className={styles.label}>{"Creator Name"}</label>
                    <input id={"creator-name"} value={creatorName} className={styles.input}
                           onChange={ev => setCreatorName(ev.target.value)}/>
                </div>
                <ButtonCTA onClick={onShare}>
                    <div>
                        <p>{isLoading ? "Saving..." : "Save & Share"}</p>
                    </div>
                </ButtonCTA>
                {gridId ?
                    <div className={styles.shareContainer}>
                        <p className={styles.shareLink}>{window.location.href}</p>
                        <button
                            title={"Copy to clipboard"}
                            className={styles.shareButton}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                            }}
                        >
                            <Copy/>
                        </button>
                    </div>
                    : null
                }
            </Popup>
            <h1>
                <input className={[styles.title, styles.input].join(" ")} value={gridName}
                       onChange={ev => setGridName(ev.target.value)}/>
            </h1>
        </>
    )
}