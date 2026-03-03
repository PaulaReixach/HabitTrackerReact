import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `btn ${isActive ? "btnPrimary" : ""}`;

  return (
    <div className="panel" style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/stats" className={linkClass}>
        Stats
      </NavLink>
      <NavLink to="/settings" className={linkClass}>
        Settings
      </NavLink>
    </div>
  );
}

export default Navbar;