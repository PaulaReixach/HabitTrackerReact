import { useState, useEffect } from "react";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";
import SearchBar from "./components/SearchBar";

function calculateStreak(completedDates) {

  let streak = 0;
  let current = new Date();

  while (true) {
    const key = current.toISOString().split("T")[0]; //hoy en formato YYYY-MM-DD

    if (completedDates.includes(key)) { 
      streak += 1;
      current.setDate(current.getDate() - 1); // retrocedemos un día
    } else {
      break; // se rompe la racha
    }
  }

  return streak;
}

function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0]; //Hoy en formato YYYY-MM-DD
}

function getYesterdayKey() {
  const d = new Date(); 
  d.setDate(d.getDate() - 1); 
  return getDateKey(d); // obtenemos la fecha de ayer en formato YYYY-MM-DD
}



function App() {
  const [habits, setHabits] = useState(() => { // Cargamos los hábitos guardados en localStorage al iniciar la aplicación
    const saved = localStorage.getItem("habits"); // obtenemos los hábitos guardados en localStorage
    if (!saved) return []; 
    return JSON.parse(saved); // parseamos el string JSON para obtener el array de hábitos
  });
  
  const [filter, setFilter] = useState("all"); //All, pending, completed

  const [search, setSearch] = useState("");

  useEffect(() => { 
    localStorage.setItem("habits", JSON.stringify(habits)); // guardamos los hábitos en localStorage cada vez que cambian 
  }, [habits]); // el efecto se ejecuta cada vez que el estado de hábitos cambia

  function addHabit(name) {
    const newHabit = {
      id: crypto.randomUUID(),
      name: name,
      completedDates: [],
    };
    setHabits((prevHabits) => [newHabit, ...prevHabits]); // añadimos el nuevo hábito al principio del array
  }

  function completeHabit(id) {
    const today = getDateKey(); 

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if(habit.id !== id) return habit; 

        if(habit.completedDates.includes(today)) { return habit; } // Si el hábito ya está marcado como completado hoy, no hacemos nada

        return {
          ...habit, 
          completedDates: [today, ...habit.completedDates], // añadimos la fecha de hoy al principio del array de fechas completadas
        }
      }))
  }

  function deleteHabit(id) {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id)); // eliminamos el hábito con el id especificado
  }


  function renameHabit(id, newName) {
    const trimmed = newName.trim();
    if (trimmed === "") return;

    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, name: trimmed } : habit
      )
    );
  }

  function completeHabitYesterday(id) { //Solo para pruebas
    const yesterday = getYesterdayKey();

    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;
        if (habit.completedDates.includes(yesterday)) return habit;

        return {
          ...habit,
          completedDates: [yesterday, ...habit.completedDates],
        };
      })
    );
  }



  //Calculamos la racha para hacer estadística
  const totalHabits = habits.length;
  const today = getDateKey();
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(today)).length;

  const sortedHabits = [...habits].sort((a, b) => {
    const aDone = a.completedDates.includes(today);
    const bDone = b.completedDates.includes(today);

    if (aDone !== bDone) return aDone ? 1 : -1; // pendientes primero
    return 0;
  });

  const searchText = search.trim().toLowerCase(); 

  const filteredHabits = sortedHabits.filter((h) => {
    const doneToday = h.completedDates.includes(today);

    if (filter === "pending" && doneToday) return false;
    if (filter === "done" && !doneToday) return false;

    if (searchText !== "" && !h.name.toLowerCase().includes(searchText)) return false;

    return true; // "all"
  });

  const progressPercent = totalHabits === 0 ? 0 : Math.round((completedTodayCount / totalHabits) * 100);

  return (
      <div className="page">
        <div className="container">
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
                  if (ok) setHabits([]);
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
                <button className={`btn ${filter === "all" ? "btnPrimary" : ""}`}onClick={() => setFilter("all")}>
                  Todos
                </button>
                <button className={`btn ${filter === "pending" ? "btnPrimary" : ""}`} onClick={() => setFilter("pending")}>
                  Pendientes
                </button>
                <button className={`btn ${filter === "done" ? "btnPrimary" : ""}`} onClick={() => setFilter("done")}>
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
        </div>
      </div>
    );
}

export default App;