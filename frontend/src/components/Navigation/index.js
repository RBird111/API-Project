import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import "./Navigation.scss";
import logo from "../../assets/airbnb_logo.svg";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navigation">
      <NavLink className="nav-logo" exact to="/">
        <img src={logo} alt="logo" />

        <h1 className="airbnb-logo">airbnb</h1>
      </NavLink>

      {isLoaded && <ProfileButton user={sessionUser} />}
    </div>
  );
}

export default Navigation;
