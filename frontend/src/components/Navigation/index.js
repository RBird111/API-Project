import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;

  if (sessionUser) {
    sessionLinks = (
      <li className="navigation">
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li className="navigation">
          <NavLink className="navigation" to="/login">
            Log In
          </NavLink>
        </li>

        <li className="navigation">
          <NavLink className="navigation" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </>
    );
  }

  return (
    <div className="navigation">
      <ul className="navigation">
        <li className="navigation">
          <NavLink className="navigation" exact to="/">
            Home
          </NavLink>
        </li>

        {isLoaded && sessionLinks}
      </ul>
    </div>
  );
};

export default Navigation;
