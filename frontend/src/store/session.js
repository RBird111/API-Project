import { csrfFetch } from "./csrf";

// ---TYPES--- \\
const SET_USER = "session/LOGIN";
const REMOVE_USER = "session/LOGOUT";

// ---ACTIONS--- \\
const _login = (user) => {
  return {
    type: SET_USER,
    user,
  };
};

const _logout = () => {
  return {
    type: REMOVE_USER,
  };
};

// ---ACTION DISPATCHERS--- \\

// Log in action
export const login =
  ({ credential, password }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential, password }),
    });

    if (response.ok) {
      const { user } = await response.json();
      dispatch(_login(user));

      return user;
    }

    const errors = await response.json();
    return errors;
  };

// Log out action
export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });

  if (response.ok) {
    const { message } = await response.json();
    dispatch(_logout());

    return message;
  }

  const errors = await response.json();
  return errors;
};

// Restore user action
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const { user } = await response.json();
    dispatch(_login(user));

    return user;
  }

  const errors = await response.json();
  return errors;
};

// Create new user action
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;

  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });

  const data = await response.json();
  dispatch(_login(data.user));
  return response;
};

// ---REDUCER--- \\
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    // User is either null or contains a single user's info
    case SET_USER: {
      return { ...state, user: action.user };
    }

    case REMOVE_USER: {
      return { ...state, user: null };
    }

    default:
      return state;
  }
};

export default sessionReducer;
