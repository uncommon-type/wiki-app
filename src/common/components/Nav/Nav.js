import { NavLink } from "react-router-dom";

import styles from "./nav.module.css";

const Nav = () => (
  <nav>
    <ul className={styles["nav"]}>
      <li>
        <NavLink to="/map" exact>
          Map
        </NavLink>
      </li>
      <li>
        <NavLink to="/list">List</NavLink>
      </li>
      <li>
        <NavLink to="/settings">Settings</NavLink>
      </li>
    </ul>
  </nav>
);

export default Nav;
