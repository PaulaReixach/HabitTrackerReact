import { useState } from "react";
import styles from "./HabitItem.module.css";
import ConfirmModal from "./ConfirmModal";
import useConfirm from "../hooks/useConfirm";

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function calculateStreak(completedDates) {
  let streak = 0;
  let current = new Date();

  while (true) {
    const key = getDateKey(current);

    if (completedDates.includes(key)) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function HabitItem({ habit, onCompleteHabit, onCompleteYesterday, onDeleteHabit, onRenameHabit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(habit.name);
  const confirmUI = useConfirm();

  const today = getDateKey();
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = calculateStreak(habit.completedDates);

  function startEditing() {
    setDraftName(habit.name);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftName(habit.name);
    setIsEditing(false);
  }

  function saveEditing() {
    const trimmed = draftName.trim();
    if (trimmed === "") return;

    onRenameHabit(habit.id, trimmed);
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEditing();
    if (e.key === "Escape") cancelEditing();
  }

  return (
    <li className={styles.item}>
      <div className={styles.top}>
        {/* IZQUIERDA: info */}
        <div style={{ flex: 1 }}>
          {!isEditing ? (
            <>
              <div className={styles.title}>
                {habit.name} {isCompletedToday && "✅"}
              </div>

              <div className={styles.meta}>
                🔥 Racha: {streak} día{streak === 1 ? "" : "s"}
              </div>

              <div className={styles.pills}>
                {isCompletedToday ? (
                  <span className={`${styles.pill} ${styles.pillSuccess}`}>
                    ✅ Hecho hoy
                  </span>
                ) : (
                  <span className={styles.pill}>⏳ Pendiente</span>
                )}

                <span className={styles.pill}>🔥 {streak} días</span>
              </div>
            </>
          ) : (
            <>
              <input
                className="input"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className={styles.meta}>Enter = guardar · Esc = cancelar</div>
            </>
          )}
        </div>

        {/* DERECHA: acciones */}
        <div className={styles.actions}>
          {!isEditing ? (
            <>
              <button
                className={`btn btnPrimary ${styles.btnLg}`}
                onClick={() => onCompleteHabit(habit.id)}
                disabled={isCompletedToday}
              >
                Hoy
              </button>

              <button
                className={`btn ${styles.btnLg}`}
                onClick={() => onCompleteYesterday(habit.id)}
              >
                Ayer
              </button>

              <button
                className={`btn ${styles.iconBtn}`}
                onClick={startEditing}
                title="Editar"
              >
                ✏️
              </button>

               <button
                className={`btn ${styles.iconBtn}`}
                onClick={async () => {
                  const ok = await confirmUI.confirm(
                      <>
                        ¿Seguro que quieres borrar <strong>{habit.name}</strong>? Esta acción no se puede deshacer.
                      </>
                  );
                  if (ok) onDeleteHabit(habit.id);
                }}
              >
                🗑️
              </button>
            </>
          ) : (
            <>
              <button className={`btn btnPrimary ${styles.btnLg}`} onClick={saveEditing}>
                Guardar
              </button>
              <button className={`btn ${styles.btnLg}`} onClick={cancelEditing}>
                Cancelar
              </button>
            </>
          )}
        </div>
          <ConfirmModal
          isOpen={confirmUI.isOpen}
          message={confirmUI.message}
          onCancel={confirmUI.onCancel}
          onConfirm={confirmUI.onConfirm}
        />
      </div>
    </li>
  );
}

export default HabitItem;