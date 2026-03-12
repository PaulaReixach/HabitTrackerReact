import { useMemo, useState } from "react";
import { useHabits } from "../context/HabitsContext";
import { dateKeyLocal, mondayIndex } from "../utils/dateKey";
import styles from "./Calendar.module.css";
import DayHabitsModal from "../components/DayHabitsModal";

function buildMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const leading = mondayIndex(first.getDay());
  const cells = [];

  for (let i = 0; i < leading; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, monthIndex, day));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export default function CalendarPage() {
  const { completedByDate } = useHabits();

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

  const todayKey = dateKeyLocal(new Date());

  // ✅ Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(todayKey);

  function openDay(key) {
    setSelectedKey(key);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function prevMonth() {
    setView((v) => {
      const m = v.monthIndex - 1;
      if (m < 0) return { year: v.year - 1, monthIndex: 11 };
      return { year: v.year, monthIndex: m };
    });
  }

  function nextMonth() {
    setView((v) => {
      const m = v.monthIndex + 1;
      if (m > 11) return { year: v.year + 1, monthIndex: 0 };
      return { year: v.year, monthIndex: m };
    });
  }

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const MAX_VISIBLE = 2;

  const modalItems = completedByDate?.[selectedKey] ?? [];
  const modalDateLabel = new Date(selectedKey).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div>
          <h2 className={styles.title}>Calendar</h2>
          <p className={styles.subtitle}>Vista mensual</p>
        </div>

        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prevMonth} type="button">◀</button>
          <div className={styles.month}>{monthLabel}</div>
          <button className={styles.navBtn} onClick={nextMonth} type="button">▶</button>
        </div>
      </div>

      <div className={styles.grid}>
        {weekDays.map((d, i) => {
          const isWeekend = i >= 5;
          return (
            <div key={d} className={`${styles.dow} ${isWeekend ? styles.weekendHead : ""}`}>
              {d}
            </div>
          );
        })}

        {cells.map((date, idx) => {
          if (!date) return <div key={idx} className={styles.blank} />;

          const key = dateKeyLocal(date);
          const items = completedByDate?.[key] ?? [];
          const count = items.length;

          const col = idx % 7;
          const isWeekend = col >= 5;
          const isToday = key === todayKey;

          const show = items.slice(0, MAX_VISIBLE);
          const moreCount = Math.max(0, items.length - show.length);

          return (
            <button
              key={idx}
              type="button"
              className={[
                styles.cell,
                isWeekend ? styles.weekend : "",
                isToday ? styles.today : "",
              ].join(" ")}
              onClick={() => openDay(key)}
            >
              <div className={styles.cellHeader}>
                <div className={`${styles.dayNum} ${isToday ? styles.dayNumToday : ""}`}>
                  {date.getDate()}
                </div>

                {count > 0 && <div className={styles.countPill}>{count}</div>}
              </div>

              <div className={styles.items}>
                {count === 0 ? (
                  <div className={styles.empty} />
                ) : (
                  <>
                    {show.map((h) => (
                      <div key={h.id} className={styles.event} title={h.name}>
                        {h.name}
                      </div>
                    ))}

                    {moreCount > 0 && (
                      <button
                        type="button"
                        className={styles.moreBtn}
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ no dispara el click del botón padre dos veces
                          openDay(key);
                        }}
                      >
                        + ver más
                      </button>
                    )}
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <DayHabitsModal
        isOpen={isModalOpen}
        dateLabel={modalDateLabel}
        items={modalItems}
        onClose={closeModal}
      />
    </div>
  );
}