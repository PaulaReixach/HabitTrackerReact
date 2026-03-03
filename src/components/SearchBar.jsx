function SearchBar({value, onChange}) {
    return (
        <input 
            className="input"
            type="text"
            placeholder="Buscar hábito..."
            value={value}
            onChange={(e)=> onChange(e.target.value)}
        />
    );
}

export default SearchBar;   