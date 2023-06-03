import { ReactNode, useState } from "react";
import styles from "../styles/Popup.module.css";
import { Popover } from "@headlessui/react";

interface PopupProps {
  label: ReactNode,
  containerClassName?: string,
  children: ReactNode,
  defaultToggled?: boolean
}

export default function Popup({ label, containerClassName, children }: PopupProps) {
  return (
    <Popover className={`${styles.container} ${containerClassName || ""}`}>
      {label ? <Popover.Button>{label}</Popover.Button> : null}
      <Popover.Panel className={styles.popup}>{children}</Popover.Panel>
    </Popover>
  );
}