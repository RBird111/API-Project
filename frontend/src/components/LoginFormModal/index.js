import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";
import "./LoginForm.scss";
import { useHistory } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fieldsInvalid = !credential.length || !password.length;

    if (fieldsInvalid) setDisabled(true);
    else setDisabled(false);
  }, [credential.length, password.length]);

  // login as Demo User action
  const loginDemo = (e) => {
    e.preventDefault();
    dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    );
    closeModal();
    history.push("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .then(() => history.push("/"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login">
      <h1>Log In</h1>

      {errors &&
        Object.values(errors).map((error) => <p className="error">{error}</p>)}

      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            autoFocus={true}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={disabled}>
          Log In
        </button>
      </form>

      <button className="demo-user" onClick={loginDemo}>
        Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
