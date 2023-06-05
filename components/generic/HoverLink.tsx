import React from "react";
import styles from "../../styles/Link.module.css";
import HoverReveal from "./HoverReveal";
import Link from "next/link";


interface HoverLinkProps {
  icon: JSX.Element,
  label: string,
  onClick?: () => unknown,
  target: string
}

export default function HoverLink({ icon, label, onClick, target }: HoverLinkProps
): JSX.Element {
  const content = (
    <div className={styles.content}>
      {icon}
      <p>{label}</p>
    </div>
  )
  return (
    <Link className={styles.link} href={target} onClick={onClick} passHref>
      <HoverReveal colors={["#EAA05B", "#D0542F"]}>
        {content}
      </HoverReveal>
    </Link>
  );
}