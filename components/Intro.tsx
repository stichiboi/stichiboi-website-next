import Mountains from "./Mountains";
import styles from "../styles/Intro.module.css";
import {useTranslation} from "next-export-i18n";
import Image from "next/image";
import Link from "./generic/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedin, faGithub} from "@fortawesome/free-brands-svg-icons";
import HoverReveal from "./generic/HoverReveal";
import DiscoverLine from "./generic/DiscoverLine";
import {CSSProperties} from "react";

export default function Intro(): JSX.Element {
    const {t} = useTranslation();

    return (
        <Mountains>
            <main id={"intro"} className={styles.container}>
                <div className={styles.imageContainer}>
                    <div className={styles.imageAccent}/>
                    <p className={styles.imageDescription}>{t("intro.imageAlt")}</p>
                    <Image src={"/profile-picture.png"}
                           alt={t("intro.imageAlt")}
                           className={styles.image}
                           height={528} width={418}/>
                    <div className={styles.imageAccent}/>
                </div>
                <div className={styles.links}>
                    <hr className={styles.line}/>
                    <HoverReveal colors={["white", "#7E86A5", "#485C80", "#0D1524"]}>
                        <h2 className={styles.title}>
                            {t("intro.title")}
                        </h2>
                    </HoverReveal>
                    <Link label={t("intro.linkedIn")}
                          icon={<FontAwesomeIcon icon={faLinkedin} size={"lg"}/>}
                          target={"https://www.linkedin.com/in/daniele-mazzotta-1714b9161/"}
                    />
                    <Link label={t("intro.gitHub")}
                          icon={<FontAwesomeIcon icon={faGithub} size={"lg"}/>}
                          target={"https://github.com/stichiboi"}
                    />
                    <DiscoverLine label={t("intro.discover")}
                                  scrollToID={"projects"}
                                  style={{
                                      "--color": "var(--color-light)",
                                      alignSelf: "flex-end"
                                  } as unknown as CSSProperties}/>
                </div>
            </main>
        </Mountains>
    )
}