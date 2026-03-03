import { useHabits } from "../hooks/useHabits";

function SettingsPage() {
  const { resetAll } = useHabits();

  return (
    <div className="panel">
      <h3 style={{ margin: 0, marginBottom: 10 }}>Settings</h3>

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
  );
}

export default SettingsPage;