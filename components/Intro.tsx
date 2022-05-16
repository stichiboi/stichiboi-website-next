import Mountains from "./Mountains";
import styles from "../styles/Intro.module.css";
import {useTranslation} from "next-export-i18n";
import Image from "next/image";
import Link from "./generic/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedin, faGithub} from "@fortawesome/free-brands-svg-icons";

export default function Intro(): JSX.Element {
    const {t} = useTranslation();

    return (
        <Mountains>
            <main id={"intro"} className={styles.container}>
                <div className={styles.imageContainer}>
                    <div className={styles.imageAccent}/>
                    <Image src={"/profile-picture.png"}
                           alt={t("intro.imageAlt")}
                           className={styles.image}
                           height={528} width={418}/>
                    <div className={styles.imageAccent}/>
                </div>
                <div className={styles.links}>
                    <hr className={styles.line}/>
                    <h2 className={styles.title}>
                        {t("intro.title")}
                    </h2>
                    <Link label={t("intro.linkedIn")}
                          icon={<FontAwesomeIcon icon={faLinkedin} size={"lg"}/>}
                          target={"https://www.linkedin.com/in/daniele-mazzotta-1714b9161/"}
                    />
                    <Link label={t("intro.gitHub")}
                          icon={<FontAwesomeIcon icon={faGithub} size={"lg"}/>}
                          target={"https://github.com/stichiboi"}
                    />
                </div>
            </main>
        </Mountains>
    )
}