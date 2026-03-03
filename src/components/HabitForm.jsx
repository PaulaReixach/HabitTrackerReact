import { useState } from "react";

function HabitForm({onAddHabit}){
    const [name, setName] = useState("");

    function handleSubmit(event) {
        event.preventDefault(); // evita que la página se recargue al enviar el form

        const trimmed = name.trim();
        if (trimmed === "") return; // no añadimos hábitos vacíos

        onAddHabit(trimmed); // le mandamos el texto al componente padre
        setName(""); // limpiamos el input
    }

   return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
            type="text"
            placeholder="Ej: Beber 2L de agua"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" style={{ padding: "10px 14px" }}>
            Añadir
        </button>
        </form>
    );


}

export default HabitForm;