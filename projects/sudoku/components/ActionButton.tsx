import React, { ReactNode } from "react";
import styles from "../styles/ActionButton.module.css";


interface ActionButtonProps {
  children: ReactNode,
  onClick: () => unknown,
  className?: string,
  isToggled?: boolean,
  fill?: boolean,
  tooltip?: string
}

export default function ActionButton({
  children,
  onClick,
  className,
  isToggled,
  fill,
  tooltip
}: ActionButtonProps) {


  const classes = [
    styles.buttonAction,
    isToggled && styles.toggled,
    fill && styles.fill,
    className
  ].filter(Boolean);

  return (
    <button title={tooltip} className={classes.join(" ")} onClick={onClick}>
      {children}
    </button>
  )
}
