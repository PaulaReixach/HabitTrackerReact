import { createContext, useContext, useMemo} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

/* Helpers */
function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateKey(d);
}

function calculateStreak(completedDates) {
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

const HabitsContext = createContext(null);

function HabitsProvider({ children }) {
  const [habits, setHabits] = useLocalStorage("habits", []);

  function addHabit(name) {
    const trimmed = name.trim();
    if (trimmed === "") return;

    const newHabit = {
      id: crypto.randomUUID(),
      name: trimmed,
      completedDates: [],
    };

    setHabits((prev) => [newHabit, ...prev]);
  }

  function completeHabit(id) {
    const today = getDateKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        if (h.completedDates.includes(today)) return h;
        return { ...h, completedDates: [today, ...h.completedDates] };
      })
    );
  }

  function completeHabitYesterday(id) { 
    const yesterday = getYesterdayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        if (h.completedDates.includes(yesterday)) return h;
        return { ...h, completedDates: [yesterday, ...h.completedDates] };
      })
    );
  }


  function deleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function renameHabit(id, newName) {
    const trimmed = newName.trim();
    if (trimmed === "") return;

    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: trimmed } : h))
    );
  }

  function resetAll() {
    setHabits([]);
  }

  function exportHabits(){
    const data = JSON.stringify(habits, null, 2);
    const blob = new Blob([data], { type: "application/json" }); 
    const url = URL.createObjectURL(blob); 

    const a = document.createElement("a");
    a.href = url; 
    a.download = "habits.json";
    a.click();

    URL.revokeObjectURL(url); // Limpia el objeto URL después de la descarga
  }

  function importHabits(file){
    setHabits(file);
  }


  const today = getDateKey();
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(today)).length;
  const progressPercent =
    totalHabits === 0 ? 0 : Math.round((completedTodayCount / totalHabits) * 100);

  const habitsWithStreak = useMemo(() => {
    return habits.map((h) => ({
      ...h,
      streak: calculateStreak(h.completedDates),
      doneToday: h.completedDates.includes(today),
    }));
  }, [habits, today]);

  const value = {
    habits,

    addHabit,
    completeHabit,
    completeHabitYesterday,
    deleteHabit,
    renameHabit,
    resetAll,
  
    //Settings
    exportHabits,
    importHabits,

    today,
    totalHabits,
    completedTodayCount,
    progressPercent,

    habitsWithStreak,

  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}


function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside <HabitsProvider>");
  return ctx;
}

export { HabitsProvider, useHabits };