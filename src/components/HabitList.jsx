import HabitItem from "./HabitItem"; 



function HabitList({ 
  habits, 
  onCompleteHabit, 
  onCompleteYesterday, 
  onDeleteHabit, 
  onRenameHabit 
}) { // Componente que muestra la lista de hábitos
  if (habits.length === 0) {
    return <p style={{ opacity: 0.7 }}>Aún no tienes hábitos. Añade el primero! 👆</p>;
  }

  return (
    <ul className="list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onCompleteHabit={onCompleteHabit}
          onCompleteYesterday={onCompleteYesterday}
          onRenameHabit={onRenameHabit}
          onDeleteHabit={onDeleteHabit}
        />
      ))}
    </ul>
  );
}

export default HabitList;