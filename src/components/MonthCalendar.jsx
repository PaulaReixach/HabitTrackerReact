import { useMemo, useState } from "react";
import styles from "./MonthCalendar.module.css";

function getDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function mondayIndex(jsDay) {
  return (jsDay + 6) % 7; // lunes=0 ... domingo=6
}

function buildMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const leadingBlanks = mondayIndex(first.getDay());
  const cells = [];

  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, monthIndex, day));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export default function MonthCalendar({ completedDates, onToggleDate }) {
  const todayKey = getDateKey(new Date());

  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  });

  const cells = useMemo(
    () => buildMonthCells(view.year, view.monthIndex),
    [view.year, view.monthIndex]
  );

  const monthLabel = new Date(view.year, view.monthIndex, 1).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  function goPrev() {
    setView((v) => {
      const m = v.monthIndex - 1;
      if (m < 0) return { year: v.year - 1, monthIndex: 11 };
      return { year: v.year, monthIndex: m };
    });
  }

  function goNext() {
    setView((v) => {
      const m = v.monthIndex + 1;
      if (m > 11) return { year: v.year + 1, monthIndex: 0 };
      return { year: v.year, monthIndex: m };
    });
  }

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button className="btn" onClick={goPrev} type="button">◀</button>
        <h4 className={styles.title}>{monthLabel}</h4>
        <button className="btn" onClick={goNext} type="button">▶</button>
      </div>

      <div className={styles.grid}>
        {weekDays.map((d) => (
          <div key={d} className={`${styles.cell} ${styles.dow}`}>{d}</div>
        ))}

        {cells.map((date, idx) => {
          if (!date) return <div key={idx} className={`${styles.cell} ${styles.empty}`} />;

          const key = getDateKey(date);
          const done = completedDates.includes(key);

          const isFuture = key > todayKey;
          const isPastOrToday = key <= todayKey;

          let cls = styles.normal;
          if (done) cls = styles.done;
          else if (isPastOrToday) cls = styles.missed;
          else cls = styles.future;

          return (
            <button
              key={idx}
              type="button"
              className={`${styles.cell} ${cls}`}
              onClick={() => !isFuture && onToggleDate?.(key)}
              disabled={isFuture}
              title={key}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={`${styles.dot} ${styles.done}`} /> Hecho
        <span className={`${styles.dot} ${styles.missed}`} /> Faltó
        <span className={`${styles.dot} ${styles.future}`} /> Futuro
      </div>
    </div>
  );
}