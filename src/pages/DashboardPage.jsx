import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import SearchBar from "../components/SearchBar";
import { useHabits } from "../context/HabitsContext";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";

function DashboardPage() {
  const {
    habits,
    today,
    totalHabits,
    completedTodayCount,
    progressPercent,
    addHabit,
    completeHabit,
    completeHabitYesterday,
    deleteHabit,
    renameHabit,
    resetAll,
  } = useHabits();

  const confirmUI = useConfirm();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredHabits = useMemo(() => {
    const sorted = [...habits].sort((a, b) => {
      const aDone = a.completedDates.includes(today);
      const bDone = b.completedDates.includes(today);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return 0;
    });

    const searchText = search.trim().toLowerCase();

    return sorted.filter((h) => {
      const doneToday = h.completedDates.includes(today);

      if (filter === "pending" && doneToday) return false;
      if (filter === "done" && !doneToday) return false;
      if (searchText !== "" && !h.name.toLowerCase().includes(searchText)) return false;

      return true;
    });
  }, [habits, today, filter, search]);

  return (
    <>
      <div className="header">
        <div>
          <h1 className="title">Habit Tracker</h1>
          <p className="subtitle">Panel de hábitos con rachas + guardado local</p>
        </div>

        <div className="actionsRow">
          <button
            className="btn btnDanger"
            onClick={async () => {
              const ok = await confirmUI.confirm(
                "¿Estás seguro de que quieres borrar todos los hábitos? Esta acción no se puede deshacer."
              );
              if (ok) resetAll();
            }}
            type="button"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Trash2 size={16} />
            <span>Borrar todo</span>
          </button>
        </div>
      </div>

      <div className="grid">
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

      <ConfirmModal
        isOpen={confirmUI.isOpen}
        message={confirmUI.message}
        onCancel={confirmUI.onCancel}
        onConfirm={confirmUI.onConfirm}
      />
    </>
  );
}

export default DashboardPage;