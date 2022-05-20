import M1 from "../public/mountains/mountain-1.svg";
import M2 from "../public/mountains/mountain-2.svg";
import M3 from "../public/mountains/mountain-3.svg";
import M4 from "../public/mountains/mountain-4.svg";
import M5 from "../public/mountains/mountain-5.svg";
import M6 from "../public/mountains/mountain-6.svg";
import C1 from "../public/mountains/clouds/cloud-1.svg";
import C2 from "../public/mountains/clouds/cloud-2.svg";
import C3 from "../public/mountains/clouds/cloud-3.svg";
import T1 from "../public/mountains/trees/tree-1.svg";
import styles from "../styles/Mountains.module.css";
import {useCallback} from "react";
import {Parallax, ParallaxProvider} from "react-scroll-parallax";

export default function Mountains({
                                      children
                                  }: { children: JSX.Element }): JSX.Element {

    const buildMountains = useCallback((flip = 1) => (
        <ParallaxProvider>
            <div className={styles.graphics} style={flip === -1 ? {
                transform: "rotateZ(180deg)",
            } : {}}>
                <div className={styles.clouds}>
                    <Parallax speed={-25 * flip}><C1/></Parallax>
                    <Parallax speed={-20 * flip}><C2/></Parallax>
                    <Parallax speed={-23 * flip}><C3/></Parallax>
                </div>
                <div className={styles.mountains}>
                    <Parallax speed={-30 * flip}>
                        <div className={styles.sunset}/>
                    </Parallax>
                    <Parallax speed={-25 * flip}><M1/></Parallax>
                    <Parallax speed={-20 * flip}><M2/></Parallax>
                    <Parallax speed={-15 * flip}><M3/></Parallax>
                    <Parallax speed={-10 * flip}><M4/></Parallax>
                    <Parallax speed={-5 * flip}>
                        <div className={`${styles.trees} ${styles.treesMiddle}`}>
                            <T1/>
                            <T1/>
                            <T1/>
                            <T1/>
                            <T1/>
                            <T1/>
                        </div>
                        <M5/>
                    </Parallax>
                    <Parallax>
                        <div className={`${styles.trees} ${styles.treesFront}`}>
                            <T1/>
                            <T1/>
                            <T1/>
                            <T1/>
                        </div>
                        <M6/>
                    </Parallax>
                </div>
            </div>
        </ParallaxProvider>
    ), []);

    return (
        <div className={styles.container}>
            {buildMountains()}
            <div className={styles.children}>
                {children}
            </div>
            {buildMountains(-1)}
        </div>
    )
}