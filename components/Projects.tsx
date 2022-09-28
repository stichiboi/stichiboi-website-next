import React from "react";
import Snow from "./Snow";
import styles from "../styles/Projects.module.css";

export default function Projects(): JSX.Element {
    return (
        <main id={"projects"} className={styles.container}>
            <div className={styles.snow}>
                {/*<Snow/>*/}
            </div>
            <div>
                Sudoku
            </div>
            <div>
                Reflexo
            </div>
            <div>
                Clock
            </div>
        </main>
    );
}