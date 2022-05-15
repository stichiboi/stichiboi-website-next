import M1 from "../public/mountains/mountain-1.svg";
import M2 from "../public/mountains/mountain-2.svg";
import M3 from "../public/mountains/mountain-3.svg";
import M4 from "../public/mountains/mountain-4.svg";
import M5 from "../public/mountains/mountain-5.svg";
import M6 from "../public/mountains/mountain-6.svg";
import styles from "../styles/Mountains.module.css";
import {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {Parallax, ParallaxProvider} from "react-scroll-parallax";

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


        window.addEventListener("scroll", changeColor);

        return window.removeEventListener("scroll", changeColor);
    }, [mountainsRef]);

    const buildMountains = useCallback((flip = 1) => (
        <ParallaxProvider>
            <div className={styles.mountains}
                 style={flip === -1 ? {
                     transform: "rotateZ(180deg)",
                 } : {}}>
                <Parallax speed={-30 * flip}>
                    <div className={styles.sunset}/>
                </Parallax>
                <Parallax speed={-25 * flip}><M1/></Parallax>
                <Parallax speed={-20 * flip}><M2/></Parallax>
                <Parallax speed={-15 * flip}><M3/></Parallax>
                <Parallax speed={-10 * flip}><M4/></Parallax>
                <Parallax speed={-5 * flip}><M5/></Parallax>
                <M6/>
            </div>
        </ParallaxProvider>
    ), []);

    return (
        <div ref={mountainsRef} className={styles.container}>
            {buildMountains()}
            <div className={styles.children}>
                {children}
            </div>
            {buildMountains(-1)}
        </div>
    )
}