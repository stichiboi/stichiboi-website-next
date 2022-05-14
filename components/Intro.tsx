import Mountains from "./Mountains";
import styles from "../styles/Intro.module.css";
import {useTranslation} from "next-export-i18n";
import {useCallback} from "react";

export default function Intro(): JSX.Element {
    const {t} = useTranslation();

    const linkWithIcon = useCallback((label: string, icon: JSX.Element, onClick: () => unknown) => (
        <button onClick={onClick}>
            {icon}
            {label}
        </button>
    ), []);


    return (
        <Mountains>
            <main id={"intro"} className={styles.container}>
                <div>
                    <img src={"/profile-picture.png"} alt={"A photo of me doing cardistry"}/>
                </div>
                <div className={styles.links}>
                    <hr className={styles.line}/>
                    <p className={styles.title}>
                        {t("intro.title")}
                    </p>
                    {linkWithIcon("CV", <div/>, () => {
                    })}
                </div>
            </main>
        </Mountains>
    )
}