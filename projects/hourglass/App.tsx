import {useState} from "react";
import {Simulation} from "./Simulation";
import {Settings} from "./Settings";
import Link from "next/link";
import Logo from "../../public/stichiboi-logo.svg";
import styles from "./app.module.css";

export function App(): JSX.Element {

    const [brushRadius, setBrushRadius] = useState(3);
    const [isErase, setIsErase] = useState(false);
    const [material, setMaterial] = useState("sand");
    const [pause, setPause] = useState(false);

    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <Settings onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase}
                          onMaterialChange={setMaterial} onPause={setPause}/>
                <Link href={"/"} passHref>
                    <Logo/>
                </Link>
            </header>
            <Simulation isErase={isErase} brushRadius={brushRadius} material={material} pause={pause}/>
        </div>
    )
}