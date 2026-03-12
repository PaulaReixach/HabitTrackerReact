import styles from "./DayHabitsModal.module.css";

function DayHabitsModal({ isOpen, dateLabel, items, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={onClose} role="presentation">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
                <div className={styles.header}>
                <div>
                    <div className={styles.title}>Hábitos del día</div>
                    <div className={styles.subtitle}>{dateLabel}</div>
                </div>

                <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Cerrar">
                    ✕
                </button>
                </div>

                <div className={styles.body}>
                {items.length === 0 ? (
                    <div className={styles.empty}>No hay ningún hábito aún</div>
                ) : (
                    <ul className={styles.list}>
                    {items.map((h) => (
                        <li key={h.id} className={styles.row}>
                        <span className={styles.dot} />
                        <span className={styles.name}>{h.name}</span>
                        </li>
                    ))}
                    </ul>
                )}
                </div>

                <div className={styles.footer}>
                <button className={styles.okBtn} onClick={onClose} type="button">
                    Cerrar
                </button>
                </div>
            </div>
            </div>
    );
}

export default DayHabitsModal;