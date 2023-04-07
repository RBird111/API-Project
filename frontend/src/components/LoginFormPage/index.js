import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import "./LoginFormPage.css";

const LoginFormPage = () => {
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <div className="login">
      <h1 className="login">Log In</h1>
      <form className="login" onSubmit={handleSubmit}>
        <label className="login" htmlFor="credential">
          Username or Email
          <input
            className="login"
            type="text"
            name="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>

        <label className="login">
          Password
          <input
            className="login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.credential && <p className="login">{errors.credential}</p>}

        <button type="submit" className="login">
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginFormPage;
