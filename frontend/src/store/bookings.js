import { csrfFetch } from "./csrf";
import { normalize } from ".";

// ---TYPES--- \\
const GET_USER_BOOKINGS = "bookings/USER";
const GET_SPOT_BOOKINGS = "bookings/SPOT";
const CREATE_BOOKING = "bookings/CREATE";
const EDIT_BOOKING = "bookings/EDIT";
const DELETE_BOOKING = "bookings/DELETE";

// ---ACTIONS--- \\
const _getUserBookings = (bookings) => {
  return {
    type: GET_USER_BOOKINGS,
    bookings,
  };
};

const _getSpotBookings = (bookings) => {
  return {
    type: GET_SPOT_BOOKINGS,
    bookings,
  };
};

const _createBooking = (booking) => {
  return {
    type: CREATE_BOOKING,
    booking,
  };
};

const _deleteBooking = (bookingId) => {
  return {
    type: DELETE_BOOKING,
    bookingId,
  };
};

const _editBooking = (booking) => {
  return {
    type: EDIT_BOOKING,
    booking,
  };
};

// ---ACTION DISPATCHERS--- \\
export const getUserBookings = () => async (dispatch) => {
  const response = await csrfFetch("/api/bookings/current");

  // Place at end of code use gaurd for fail case and handle normalization in the reducer, not thunk
  if (response.ok) {
    const { Bookings } = await response.json();

    dispatch(_getUserBookings(Bookings));

    return Bookings;
  }

  const errors = await response.json();
  return errors;
};

export const getSpotBookings = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

  if (response.ok) {
    const { Bookings } = await response.json();

    dispatch(_getSpotBookings(Bookings));

    return Bookings;
  }

  const errors = await response.json();
  return errors;
};

export const createBooking = (spotId, booking) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });

  if (response.ok) {
    const booking = await response.json();
    dispatch(_createBooking(booking));

    return booking;
  }

  const errors = await response.json();
  return errors;
};

export const deleteBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const { message } = await response.json();
    dispatch(_deleteBooking(bookingId));

    return message;
  }

  const errors = await response.json();
  return errors;
};

export const editBooking = (booking) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${booking.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });

  if (response.ok) {
    const booking = await response.json();
    dispatch(_editBooking(booking));

    return booking;
  }

  const errors = await response.json();
  return errors;
};

// ---REDUCER--- \\
const initialState = { userBookings: {}, spotBookings: {} };

const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_BOOKINGS: {
      const newState = normalize(state);
      newState.userBookings = normalize(action.bookings);
      return newState;
    }

    case GET_SPOT_BOOKINGS: {
      const newState = normalize(state);
      newState.spotBookings = normalize(action.bookings);
      return newState;
    }

    case CREATE_BOOKING: {
      const newState = normalize(state);
      newState.spotBookings[action.booking.id] = normalize(action.booking);
      newState.userBookings[action.booking.id] = normalize(action.booking);
      return newState;
    }

    case EDIT_BOOKING: {
      const newState = normalize(state);
      newState.spotBookings[action.booking.id] = normalize(action.booking);
      newState.userBookings[action.booking.id] = normalize(action.booking);
      return newState;
    }

    case DELETE_BOOKING: {
      const newState = normalize(state);
      delete newState.spotBookings[action.bookingId];
      delete newState.userBookings[action.bookingId];
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default bookingsReducer;
