import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;

    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      console.log("click");
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();

    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="navigation-div" ref={ulRef}>
      <button className="navigation" onClick={openMenu}>
        <i className="fa-sharp fa-regular fa-user navigation" />
      </button>

      <ul className={`${ulClassName}`}>
        <li className="navigation">{user.username}</li>

        <li className="navigation">
          {user.firstName} {user.lastName}
        </li>

        <li className="navigation">{user.email}</li>

        <li className="navigation">
          <button className="navigation" onClick={logout}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileButton;
