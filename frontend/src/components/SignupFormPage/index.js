import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import * as sessionActions from "../../store/session";
import "./SignupFormPage.css";

function SignupFormPage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
    }

    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup">
      <h1 className="signup">Sign Up</h1>

      <form className="signup" onSubmit={handleSubmit}>
        <label className="signup">
          Email
          <input
            className="signup"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {errors.email && <p>{errors.email}</p>}

        <label className="signup">
          Username
          <input
            className="signup"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        {errors.username && <p>{errors.username}</p>}

        <label className="signup">
          First Name
          <input
            className="signup"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        {errors.firstName && <p>{errors.firstName}</p>}

        <label className="signup">
          Last Name
          <input
            className="signup"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        {errors.lastName && <p>{errors.lastName}</p>}

        <label className="signup">
          Password
          <input
            className="signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.password && <p>{errors.password}</p>}

        <label className="signup">
          Confirm Password
          <input
            className="signup"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button className="signup" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormPage;
