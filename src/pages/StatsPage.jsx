import { useHabits } from "../context/HabitsContext";
import styles from "./StatsPage.module.css";

function StatsPage() {
  const { habitsWithStreak, totalHabits, completedTodayCount } = useHabits();

  const top = [...habitsWithStreak]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const best = top[0];

  return (
    <div className={`panel ${styles.statsPage}`}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Stats</h2>
          <p className={styles.subtitle}>Resumen de tus hábitos y tus mejores rachas</p>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.statCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Total hábitos</span>
            <span className={styles.cardIcon}>📚</span>
          </div>
          <div className={styles.cardValue}>{totalHabits}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Completados hoy</span>
            <span className={styles.cardIcon}>✅</span>
          </div>
          <div className={styles.cardValue}>{completedTodayCount}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.highlightCard}>
          <div className={styles.sectionLabel}>Mejor racha</div>

          {best ? (
            <>
              <div className={styles.bestName}>{best.name}</div>
              <div className={styles.bestMeta}>🔥 {best.streak} día{best.streak === 1 ? "" : "s"}</div>
            </>
          ) : (
            <div className={styles.empty}>Aún no hay datos</div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.listCard}>
          <div className={styles.sectionLabel}>Top 5 rachas</div>

          {top.length === 0 ? (
            <div className={styles.empty}>Todavía no hay hábitos con racha</div>
          ) : (
            <div className={styles.ranking}>
              {top.map((h, index) => (
                <div key={h.id} className={styles.rankRow}>
                  <div className={styles.rankLeft}>
                    <div className={styles.rankNumber}>#{index + 1}</div>
                    <div>
                      <div className={styles.habitName}>{h.name}</div>
                      <div className={styles.habitMeta}>Racha actual</div>
                    </div>
                  </div>

                  <div className={styles.rankValue}>
                    {h.streak} día{h.streak === 1 ? "" : "s"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;