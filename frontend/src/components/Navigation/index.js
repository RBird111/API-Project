import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import "./Navigation.scss";
import logo from "../../assets/scp_logo.svg";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigation">
      <NavLink className="nav-logo" exact to="/">
        <img src={logo} alt="logo" />

        <h1 className="logo">scpnb</h1>
      </NavLink>

      {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;
