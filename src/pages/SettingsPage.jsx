import { useState } from "react";
import { useHabits } from "../context/HabitsContext";

function SettingsPage() {
  const { habits, resetAll, exportHabits, importHabits } = useHabits();
  const [error, setError] = useState("");

  function isValidHabitsArray(data) {
    if (!Array.isArray(data)) return false;

    return data.every((h) => {
      const hasId = typeof h.id === "string";
      const hasName = typeof h.name === "string";
      const hasCompletedDates =
        Array.isArray(h.completedDates) &&
        h.completedDates.every((d) => typeof d === "string");
      return hasId && hasName && hasCompletedDates;
    });
  }

  function handleFileChange(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (!isValidHabitsArray(parsed)) {
          setError("El JSON no tiene el formato correcto.");
          return;
        }

        const ok = confirm("Esto reemplazará tus hábitos actuales. ¿Continuar?");
        if (!ok) return;

        importHabits(parsed);
      } catch {
        setError("Archivo inválido: no es un JSON válido.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="panel">
      <h3 style={{ margin: 0, marginBottom: 10 }}>Settings</h3>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Guarda y recupera tus hábitos.
      </p>

      <div className="actionsRow" style={{ marginTop: 12 }}>
        <button className="btn btnPrimary" onClick={exportHabits} disabled={habits.length === 0}>
          Exportar (habits.json)
        </button>

        <label className="btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          Importar JSON
          <input
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        <button
          className="btn btnDanger"
          onClick={() => {
            const ok = confirm("¿Seguro que quieres borrar todos los hábitos?");
            if (ok) resetAll();
          }}
        >
          Reset total
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default SettingsPage;