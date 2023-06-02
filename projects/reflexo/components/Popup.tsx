import { ReactNode, useState } from "react";
import styles from "../styles/Popup.module.css";

interface PopupProps {
  label?: ReactNode,
  children: ReactNode,
  defaultToggled?: boolean
}

export default function Popup({ label, children, defaultToggled }: PopupProps) {
  const [toggled, setToggled] = useState(defaultToggled || false);

  return (
    <div className={styles.container}>
      {label ?
        <button onClick={() => setToggled(prev => !prev)}>
          {label}
        </button> : null
      }
      <div className={`${styles.popup} ${toggled ? styles.toggled : ''}`}>
        {children}
      </div>
    </div>
  )
}