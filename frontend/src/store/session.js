import { csrfFetch } from "./csrf";

const LOGIN = "session/LOGIN";
const LOGOUT = "session/LOGOUT";

const _login = (user) => {
  return {
    type: LOGIN,
    user,
  };
};

const _logout = () => {
  return {
    type: LOGOUT,
  };
};

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
      const user = await response.json();
      dispatch(_login(user));

      return user;
    }
  };

// Log out action
export const logout = () => async (dispatch) => {
  const response = await fetch("/api/session", {
    method: "DELETE",
  });

  if (response.ok) {
    const message = await response.json();
    dispatch(_logout());

    return message;
  }
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    // User is either null or contains a single user's info
    case LOGIN: {
      return { ...state, user: action.user };
    }

    case LOGOUT: {
      return { ...state, user: null };
    }

    default:
      return state;
  }
};

export default sessionReducer;
