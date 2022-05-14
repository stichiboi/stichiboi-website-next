import M1 from "../public/mountains/mountain-1.svg";
import M2 from "../public/mountains/mountain-2.svg";
import M3 from "../public/mountains/mountain-3.svg";
import M4 from "../public/mountains/mountain-4.svg";
import M5 from "../public/mountains/mountain-5.svg";
import M6 from "../public/mountains/mountain-6.svg";
import styles from "../styles/Mountains.module.css";
import {CSSProperties, MutableRefObject, useCallback, useEffect, useRef} from "react";

export default function Mountains({
                                      children
                                  }: { children: JSX.Element }): JSX.Element {
    const mountainsRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
    const isBackgroundToggled = useRef(false);

    useEffect(() => {
        function changeColor() {
            const yScroll = window.scrollY || window.pageYOffset;
            const rect = mountainsRef.current.getBoundingClientRect();
            if (!isBackgroundToggled.current && yScroll > rect.top) {
                document.getElementById("home")?.style
                    .setProperty("background-color", "#FFA693");
                isBackgroundToggled.current = true;
            } else if (isBackgroundToggled.current && yScroll < rect.top) {
                document.getElementById("home")?.style
                    .setProperty("background-color", "transparent");
                isBackgroundToggled.current = false;
            }
        }

        window.addEventListener("scroll", () => changeColor());

        return window.removeEventListener("scroll", changeColor);
    }, []);

    const buildMountains = useCallback((style?: CSSProperties) => (
        <div className={styles.mountains} style={style}>
            <div className={styles.sunset}/>
            <M1/>
            <M2/>
            <M3/>
            <M4/>
            <M5/>
            <M6/>
        </div>
    ), []);

    return (
        <div ref={mountainsRef}>
            {buildMountains()}
            <div className={styles.children}>
                {children}
            </div>
            {buildMountains({transform: "rotateZ(180deg)"})}
        </div>
    )
}