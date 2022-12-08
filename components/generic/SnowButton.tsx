import React from "react";
import Snow from "../Snow";
import Button, { ButtonProps } from "./Button";
import styles from "../../styles/Snow.module.css";

export function SnowButton(props: ButtonProps): JSX.Element {
    return (
        <Button {...props}>
            <Snow className={styles.snowButton} drawProbability={.02}/>
        </Button>
    )
}