import { useHabits } from "../hooks/useHabits";

function StatsPage() {
  const { habitsWithStreak, totalHabits, completedTodayCount } = useHabits();

  const top = [...habitsWithStreak].sort((a, b) => b.streak - a.streak).slice(0, 5);
  const best = top[0];

  return (
    <div className="panel">
      <h3 style={{ margin: 0, marginBottom: 10 }}>Stats</h3>

      <div className="cards">
        <div className="card">
          <div className="cardLabel">Total hábitos</div>
          <div className="cardValue">{totalHabits}</div>
        </div>
        <div className="card">
          <div className="cardLabel">Completados hoy</div>
          <div className="cardValue">{completedTodayCount}</div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card">
        <div className="cardLabel">Mejor racha</div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>
          {best ? `${best.name} — ${best.streak} días` : "Aún no hay datos"}
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card">
        <div className="cardLabel">Top 5 rachas</div>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          {top.map((h) => (
            <li key={h.id} style={{ marginTop: 6 }}>
              <span style={{ fontWeight: 700 }}>{h.name}</span>{" "}
              <span style={{ color: "#64748b" }}>— {h.streak} días</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default StatsPage;