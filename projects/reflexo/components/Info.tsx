import { Heart, Emoji } from 'iconoir-react';
import Popup from "./Popup";
import styles from "../styles/Info.module.css";

export default function Info() {
  return (
    <Popup label={<Heart/>}>
      <p className={styles.textHeader}>
        {"Hello there!"}
      </p>
      <Emoji/>
    </Popup>
  )
}