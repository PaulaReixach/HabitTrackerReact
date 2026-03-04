import { useState } from "react";
import { useHabits } from "../context/HabitsContext";
import ConfirmModal from "../components/ConfirmModal";
import useConfirm from "../hooks/useConfirm";

function SettingsPage() {
  const { habits, resetAll, exportHabits, importHabits } = useHabits();
  const [error, setError] = useState("");
  const confirmUI = useConfirm();

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
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (!isValidHabitsArray(parsed)) {
          setError("El JSON no tiene el formato correcto.");
          return;
        }
        
        const ok = await confirmUI.confirm("Esto reemplazará tus hábitos actuales. ¿Continuar?");
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
          onClick={async () => {
            const ok = await confirmUI.confirm(
              "¿Seguro que quieres borrar todos los hábitos?"
            );
            if (ok) resetAll();
          }}
        >
          Borrar todos los hábitos para siempre
        </button>
      </div>

      {error && (
        <p style={{ marginTop: 12, color: "#b91c1c", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <ConfirmModal
            isOpen={confirmUI.isOpen}
            message={confirmUI.message}
            onCancel={confirmUI.onCancel}
            onConfirm={confirmUI.onConfirm}
          />
    </div>
  );
}

export default SettingsPage;