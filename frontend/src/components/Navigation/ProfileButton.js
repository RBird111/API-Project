import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // Open menu function
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // useEffect that closes profile window, if open, when a click
  // is registered outside the window
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // logout action
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-group">
      {user && (
        <NavLink to={"/spots/new"}>
          <p>Create a New Spot</p>
        </NavLink>
      )}

      <div className="profile-button" ref={ulRef} onClick={openMenu}>
        <i className="fa-solid fa-bars" />

        <svg viewBox="0 0 32 32">
          <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
        </svg>
      </div>

      <div className={ulClassName}>
        {user ? (
          // if there is a logged in user
          <>
            <p>Hello, {user.username}</p>

            {/* <p>
              {user.firstName} {user.lastName}
            </p> */}

            <p>{user.email}</p>

            <NavLink to={"/spots/current"}>
              <div className="manage-spot">
                <p>Manage Spots</p>
              </div>
            </NavLink>

            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          // if there is no logged in user
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
