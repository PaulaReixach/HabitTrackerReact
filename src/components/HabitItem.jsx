import { useState, useEffect, useRef } from "react";
import styles from "./HabitItem.module.css";
import ConfirmModal from "./ConfirmModal";
import useConfirm from "../hooks/useConfirm";
import MonthCalendar from "./MonthCalendar";
import { useHabits } from "../context/HabitsContext";

import { Pencil, Trash2, CalendarDays, Flame } from "lucide-react";

function getDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

function HabitItem({
  habit,
  onCompleteHabit,
  onCompleteYesterday,
  onDeleteHabit,
  onRenameHabit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(habit.name);
  const [showCalendar, setShowCalendar] = useState(false);

  const { toggleHabitDate } = useHabits();
  const confirmUI = useConfirm();

  const today = getDateKey();
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = calculateStreak(habit.completedDates);

  const [animateStreak, setAnimateStreak] = useState(false);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    if (streak !== prevStreakRef.current) {
      setAnimateStreak(true);
      const timeout = setTimeout(() => setAnimateStreak(false), 350);
      prevStreakRef.current = streak;
      return () => clearTimeout(timeout);
    }
  }, [streak]);

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
        {/* IZQUIERDA */}
        <div style={{ flex: 1 }}>
          {!isEditing ? (
            <>
              <div className={styles.title}>{habit.name}</div>

              <div className={styles.meta}>
                <Flame size={14} className={`${styles.streakIcon} ${animateStreak ? styles.streakIconAnimated : ""}`}/>
                {streak} día{streak === 1 ? "" : "s"}
              </div>

              <div className={styles.pills}>
                {isCompletedToday ? (
                  <span className={`${styles.pill} ${styles.pillSuccess}`}>
                    Hecho hoy
                  </span>
                ) : (
                  <span className={styles.pill}>Pendiente</span>
                )}

                <span className={styles.pill}>
                  {streak} día{streak === 1 ? "" : "s"}
                </span>
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

              <div className={styles.meta}>
                Enter = guardar · Esc = cancelar
              </div>
            </>
          )}
        </div>

        {/* DERECHA */}
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
                type="button"
              >
                <Pencil size={18} />
              </button>

              <button
                className={`btn ${styles.iconBtn}`}
                onClick={async () => {
                  const ok = await confirmUI.confirm(
                    <>
                      ¿Seguro que quieres borrar{" "}
                      <strong>{habit.name}</strong>? Esta acción no se puede
                      deshacer.
                    </>
                  );

                  if (ok) onDeleteHabit(habit.id);
                }}
                title="Borrar"
                type="button"
              >
                <Trash2 size={18} />
              </button>

              <button
                className={`btn ${styles.iconBtn}`}
                onClick={() => setShowCalendar((v) => !v)}
                title="Calendario"
                type="button"
              >
                <CalendarDays size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btnPrimary ${styles.btnLg}`}
                onClick={saveEditing}
              >
                Guardar
              </button>

              <button
                className={`btn ${styles.btnLg}`}
                onClick={cancelEditing}
              >
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

      {showCalendar && (
        <div style={{ marginTop: 10 }}>
          <MonthCalendar
            completedDates={habit.completedDates}
            onToggleDate={(dateKey) => toggleHabitDate(habit.id, dateKey)}
          />
        </div>
      )}
    </li>
  );
}

export default HabitItem;