import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import SearchBar from "../components/SearchBar";
import { useHabits } from "../hooks/useHabits";

function DashboardPage() {
  const {
    // state
    filter,
    search,

    // setters
    setFilter,
    setSearch,

    // actions
    addHabit,
    completeHabit,
    completeHabitYesterday,
    deleteHabit,
    renameHabit,
    resetAll,

    // derived
    filteredHabits,
    totalHabits,
    completedTodayCount,
    progressPercent,
  } = useHabits();

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <div>
          <h1 className="title">Habit Tracker</h1>
          <p className="subtitle">Panel de hábitos con rachas + guardado local</p>
        </div>

        <div className="actionsRow">
          <button
            className="btn btnDanger"
            onClick={() => {
              const ok = confirm("¿Seguro que quieres borrar todos los hábitos?");
              if (ok) resetAll();
            }}
          >
            Borrar todo 🧯
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {/* Columna izquierda */}
        <div className="stack">
          <div className="panel">
            <h3 style={{ margin: 0, marginBottom: 10 }}>Añadir hábito</h3>
            <HabitForm onAddHabit={addHabit} />
            <p className="subtitle" style={{ marginTop: 10 }}>
              Tip: Enter para añadir rápido.
            </p>
          </div>

          <div className="panel">
            <h3 style={{ margin: 0, marginBottom: 10 }}>Resumen</h3>
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

            <div className="progressWrap">
              <div className="progressTop">
                <div className="progressLabel">Progreso hoy</div>
                <div className="progressValue">
                  {completedTodayCount}/{totalHabits} · {progressPercent}%
                </div>
              </div>

              <div className="progressBar">
                <div className="progressFill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="panel">
          <h3 style={{ margin: 0, marginBottom: 10 }}>Tus hábitos</h3>

          <SearchBar value={search} onChange={setSearch} />
          <div style={{ height: 10 }} />

          <div className="actionsRow" style={{ marginBottom: 10 }}>
            <button
              className={`btn ${filter === "all" ? "btnPrimary" : ""}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`btn ${filter === "pending" ? "btnPrimary" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pendientes
            </button>
            <button
              className={`btn ${filter === "done" ? "btnPrimary" : ""}`}
              onClick={() => setFilter("done")}
            >
              Hechos hoy
            </button>
          </div>

          <div className="listWrap">
            <HabitList
              habits={filteredHabits}
              onCompleteHabit={completeHabit}
              onCompleteYesterday={completeHabitYesterday}
              onDeleteHabit={deleteHabit}
              onRenameHabit={renameHabit}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;