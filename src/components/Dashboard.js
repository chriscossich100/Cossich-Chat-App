import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import styles from "./Navigation.module.css";
import navMenuIcon from "../images/menuIcon.png";

export default function Dashboard() {

  let navButtonMobile = useRef();
  let navList = useRef();

  //if the user is not authenticated redirect to the main page:
  if (!localStorage.getItem("auth-token")) {
    return <Navigate to="/" />;
  }

  //function to handle the navigation menu for mobile views.
  function onBringMobileNav() {

    if (getComputedStyle(navButtonMobile.current).display == "none") {
      navButtonMobile.current.style.display = "block";
      // remember! we are setting timeout functions for the transitions as the parent block has a display, and transitions dont work on displays none and block. 
      // We need the display to actually be called and finished rendering before calling the transitions.
      setTimeout(() => {
        navList.current.style.transform = "translateY(0px) translateX(0px)";
      }, 100);
    } else {
      navList.current.style.transform = "translateY(-1200px) translateX(0px)";

      setTimeout(() => {
        navButtonMobile.current.style.display = "none";
      }, 500);
    }

  }

  return [
    <div key={"navigation"} className={styles.navigation}>
      <div className={styles.navOverlay} ref={navButtonMobile}>
        <nav className={styles.navOverlayNav} ref={navList}>
          <div className={styles.navOverlayDiv}>
            <NavLink onClick={onBringMobileNav} className={styles.navOverlayDivLink} to="chatrooms/">
              Cuartos de Chat
            </NavLink>
            <NavLink onClick={onBringMobileNav} className={styles.navOverlayDivLink} to="createroom/">
              Crear nuevo Cuarto
            </NavLink>
            <NavLink onClick={onBringMobileNav} className={styles.navOverlayDivLink} to="mychatrooms/">
              Tus Cuartos De Chat
            </NavLink>
            <NavLink  className={styles.navOverlayDivLink} to="logout/">
              Cerrar Seción
            </NavLink>
          </div>
        </nav>
      </div>
      <div className={[styles.homeNavContainer, styles.navContainer].join(" ")}>
        <nav className={[styles.navMenu, styles.wNavMenu].join(" ")}>
          <NavLink  className={styles.navLink} to="logout/">
            Cerrar secíon
          </NavLink>

          <NavLink  className={styles.navLink} to="chatrooms/">
            Cuartos de Chat
          </NavLink>

          <NavLink  className={styles.navLink} to="createroom/">
            Crear nuevo cuarto
          </NavLink>

          <NavLink  className={styles.navLink} to="mychatrooms/">
            Tus cuartos de chat
          </NavLink>
        </nav>

        <nav
          className={[styles.navMenuMobileView, styles.wNavMenuMobileView].join(
            " "
          )}
        >
          <NavLink
            className={[styles.navLink, styles.navLinkMobileView].join(" ")}
            to="/"
          >
            Cossich Chat
          </NavLink>
          <div
            className={[styles.navLink, styles.navLinkMobileView].join(" ")}
            to="/"
            onClick={onBringMobileNav}
          >
            <img
              src={navMenuIcon}
              alt="nav menu icon"
              height={"20px"}
              width={"20px"}
            />
          </div>
        </nav>
      </div>
    </div>,
    <Outlet key={"Outlet"} />,
  ];
}
