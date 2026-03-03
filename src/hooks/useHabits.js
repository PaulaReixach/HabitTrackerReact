import { useEffect, useMemo, useState } from "react";

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

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    if (!saved) return [];
    return JSON.parse(saved);
  });

  const [filter, setFilter] = useState("all"); // all | pending | done
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  function addHabit(name) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      completedDates: [],
    };
    setHabits((prev) => [newHabit, ...prev]);
  }

  function completeHabit(id) {
    const today = getDateKey();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        if (habit.completedDates.includes(today)) return habit;

        return { ...habit, completedDates: [today, ...habit.completedDates] };
      })
    );
  }

  function completeHabitYesterday(id) {
    const yesterday = getYesterdayKey();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;
        if (habit.completedDates.includes(yesterday)) return habit;

        return { ...habit, completedDates: [yesterday, ...habit.completedDates] };
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

  // derived data
  const today = getDateKey();
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(today)).length;
  const progressPercent =
    totalHabits === 0 ? 0 : Math.round((completedTodayCount / totalHabits) * 100);

  const filteredHabits = useMemo(() => {
    const sorted = [...habits].sort((a, b) => {
      const aDone = a.completedDates.includes(today);
      const bDone = b.completedDates.includes(today);
      if (aDone !== bDone) return aDone ? 1 : -1; // pendientes primero
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
  }, [habits, filter, search, today]);

  // stats helpers
  const habitsWithStreak = useMemo(() => {
    return habits.map((h) => ({
      ...h,
      streak: calculateStreak(h.completedDates),
      doneToday: h.completedDates.includes(today),
    }));
  }, [habits, today]);

  return {
    // state
    habits,
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
    today,

    // stats
    habitsWithStreak,
    calculateStreak,
  };
}