import styles from "../styles/StatNumber.module.css"

interface StatNumberProps {
  label: string;
  value: string | number
}

export function StatNumber({label, value}: StatNumberProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.value}>{value}</h2>
      <em className={styles.label}>{label}</em>
    </div>
  )
}