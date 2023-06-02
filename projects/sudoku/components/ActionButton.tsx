import React, { ReactNode } from "react";
import styles from "../styles/ActionButton.module.css";


interface ActionButtonProps {
  children: ReactNode,
  onClick: () => unknown,
  className?: string,
  isToggled?: boolean,
  fill?: boolean
}

export default function ActionButton({
  children,
  onClick,
  className,
  isToggled,
  fill
}: ActionButtonProps) {


  const classes = [
    styles.buttonAction,
    isToggled && styles.toggled,
    fill && styles.fill,
    className
  ].filter(Boolean);

  return (
    <button className={classes.join(" ")} onClick={onClick}>
      {children}
    </button>
  )
}
