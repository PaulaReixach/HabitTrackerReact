import {NavLink} from "react-router-dom";

function NavBar(){
    const linkStyle = ({isActive}) => ({
            textDecoration: "none",
            padding: "10px 12px",
            borderRadius: "12px",
            border: "1px solid rgba(15, 23, 42, 0.10)",
            background: isActive ? "rgba(37, 99, 235, 0.10)" : "white",
            color: "#0f172a",
            fontWeight: 650,
        });

    return (
        <div className="panel" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <NavLink to="/" end style={linkStyle}>
                Dashboard
            </NavLink>
            <NavLink to="/stats" style={linkStyle}>
                Stats
            </NavLink>
            <NavLink to="/settings" style={linkStyle}>
                Settings
            </NavLink>
        </div>
        
    );
}

export default NavBar;