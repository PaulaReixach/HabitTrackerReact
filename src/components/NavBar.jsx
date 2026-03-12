import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `btn ${isActive ? "btnPrimary" : ""}`;

    return (
        <div className="navbar">
            <div className="navbarInner">
            <NavLink to="/" end className={linkClass}>
                Dashboard
            </NavLink>

            <NavLink to="/stats" className={linkClass}>
                Stats
            </NavLink>

            <NavLink to="/calendar" className={linkClass}>
                Calendar
            </NavLink>

            <NavLink to="/settings" className={linkClass}>
                Settings
            </NavLink>
            </div>
        </div>
    );
}

export default Navbar;