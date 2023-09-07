import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import styles from "./Navigation.module.css";

export default function Home() {

  if (localStorage.getItem("auth-token")) {
    console.log("come man do we event get here");
    return <Navigate to="/home/" />;
  } 
  else {
    return [
      <div key={'home'} className={styles.navigationHome}>
        <div
          className={[styles.homeNavContainer, styles.navContainer].join(" ")}
        >
          <nav className={[styles.navMenuHome, styles.wNavMenuHome].join(" ")}>
            <NavLink className={styles.navLink} to="/login/">
              Empezar Seción
            </NavLink>

            <NavLink className={styles.navLink} to="https://github.com/chriscossich100?tab=repositories">
              Ir al Git Repo
            </NavLink>
          </nav>
        </div>
      </div>,
      <Outlet key={"Outlet"} />,
    ];
  }
}
