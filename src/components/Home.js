import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import styles from "./Navigation.module.css";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();

  function onChangeLanguage() {
    if (i18n.language == "es") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("es");
    }
  }

  if (localStorage.getItem("auth-token")) {
    return <Navigate to="/home/" />;
  } else {
    return [
      <div key={"home"} className={styles.navigationHome}>
        <div
          className={[styles.homeNavContainer, styles.navContainer].join(" ")}
        >
          <nav className={[styles.navMenuHome, styles.wNavMenuHome].join(" ")}>
            <NavLink className={styles.navLink} to="/login/">
              {t("navigation.Link1")}
            </NavLink>

            {/* <NavLink className={styles.navLink} to="https://github.com/chriscossich100?tab=repositories">
             {t('navigation.Link2')}
            </NavLink> */}
            <NavLink style = {{fontSize: "10px"}}className={styles.navLink} onClick={onChangeLanguage}>
              {i18n.language == "es" ? "English" : "Español"}
            </NavLink>
          </nav>
        </div>
      </div>,
      <Outlet key={"Outlet"} />,
    ];
  }
}
