function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0]; //Hoy en formato YYYY-MM-DD
}

function calculateStreak(completedDates) { // Calcula la racha de días consecutivos a partir de las fechas completadas
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

function HabitList({ habits, onCompleteHabit }) { // Componente que muestra la lista de hábitos
  if (habits.length === 0) {
    return <p style={{ opacity: 0.7 }}>Aún no tienes hábitos. Añade el primero! 👆</p>;
  }

  const today = getDateKey();

  return (
    <ul style={{ paddingLeft: 18 }}> 
      {habits.map((habit) => { // Iteramos sobre los hábitos para mostrarlos
        const isCompletedToday = habit.completedDates.includes(today); // Verificamos si el hábito ya fue completado hoy
        const streak = calculateStreak(habit.completedDates); // Calculamos la racha de días consecutivos para el hábito

        return (
          <li key={habit.id} style={{ marginTop: 12 }}> 
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {habit.name} {isCompletedToday && "✅"} 
                </div> 
                <div style={{ opacity: 0.7, fontSize: 14 }}> 
                  🔥 Racha: {streak} día{streak === 1 ? "" : "s"} 
                </div>
              </div>

              <button onClick={() => onCompleteHabit(habit.id)} disabled={isCompletedToday}>
                Hoy
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default HabitList;