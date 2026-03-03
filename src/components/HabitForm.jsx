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
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10 }}>
            <input
                className="input"
                type="text"
                placeholder="Ej: Beber 2L de agua"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btnPrimary" type="submit">
                Añadir
            </button>
        </form>
    );


}

export default HabitForm;