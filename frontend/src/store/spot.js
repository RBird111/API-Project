import { csrfFetch } from "./csrf";

// ---TYPES--- \\
const GET_ALL_SPOTS = "spots/GET_ALL";

// ---ACTIONS--- \\
const _getAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

// ---ACTION DISPATCHERS--- \\
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const { Spots } = await response.json();

    const spots = {};
    Spots.forEach((spot) => (spots[spot.id] = spot));

    dispatch(_getAllSpots(spots));

    return spots;
  }
};

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      return { ...state, ...action.spots };
    }

    default:
      return state;
  }
};

export default spotReducer;
