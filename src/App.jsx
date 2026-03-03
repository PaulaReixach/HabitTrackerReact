import { useState, useEffect } from "react";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";

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

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>Habit Tracker</h1>
      <p style={{ marginTop: 0, opacity: 0.7 }}>
        Paso 1: Añadir hábitos y listarlos.
      </p>

      <button
        onClick={() => setHabits([])}
        style={{ marginBottom: 12, padding: "8px 12px" }}
      >
        Borrar todo 🧯
      </button>

      <HabitForm onAddHabit={addHabit} />

      <div style={{ marginTop: 18 }}>
        <HabitList habits={habits} onCompleteHabit={completeHabit} />
      </div>
    </div>
  );
}

export default App;