import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import "./Navigation.scss";
import logo from "../../assets/scp_logo.svg";
import { getAllSpots, searchSpots } from "../../store/spot";

function Navigation({ isLoaded, setIsSearch }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const sessionUser = useSelector((state) => state.session.user);

  const handleEnter = async (e) => {
    if (e.code === "Enter") {
      await handleClick(e);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    await dispatch(searchSpots({ query: search }));
    setIsSearch({ query: search, search: true });
    history.push("/");
    setSearch("");
  };

  const logoClick = async (e) => {
    e.preventDefault();

    setSearch("");
    await dispatch(getAllSpots());
  };

  return (
    <nav className="navigation">
      <div onClick={logoClick}>
        <NavLink className="nav-logo" exact to="/">
          <img src={logo} alt="logo" />
          <h1 className="logo">scpnb</h1>
        </NavLink>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onFocus={() => {
            const div = document.querySelector("div.search-bar");
            div.id = "active-search";
          }}
          onBlur={() => {
            const div = document.querySelector("div.search-bar");
            div.id = "";
          }}
          onKeyDown={handleEnter}
          onChange={(e) => setSearch(e.target.value)}
        />
        <i className="fa-solid fa-magnifying-glass" onClick={handleClick} />
      </div>

      {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;
