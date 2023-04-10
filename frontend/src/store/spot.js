import { csrfFetch } from "./csrf";

// ---TYPES--- \\
const GET_SPOTS = "spots/GET_ALL";
const GET_SPOT_DETAILS = "spots/DETAILS";

// ---ACTIONS--- \\
const _getAllSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots,
  };
};

const _getSpotDetails = (spotDetails) => {
  return {
    type: GET_SPOT_DETAILS,
    spotDetails,
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

  return response;
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(_getSpotDetails(spotDetails));

    return spotDetails;
  }

  return response;
};

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      return { ...state, ...action.spots };
    }

    case GET_SPOT_DETAILS:
      return { ...state, [action.spotDetails.id]: action.spotDetails };

    default:
      return state;
  }
};

export default spotReducer;
