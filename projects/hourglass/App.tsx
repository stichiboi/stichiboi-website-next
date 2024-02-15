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

    return (
        <div>
            <header className={styles.header}>
                <Settings onBrushSizeChange={setBrushRadius} onIsEraseChange={setIsErase}
                          onMaterialChange={setMaterial}/>
                <Link href={"/"} passHref>
                    <Logo/>
                </Link>
            </header>
            <Simulation isErase={isErase} brushRadius={brushRadius} material={material}/>
        </div>
    )
}