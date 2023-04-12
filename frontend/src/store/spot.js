import { csrfFetch } from "./csrf";

// ---TYPES--- \\
const GET_SPOTS = "spots/GET_ALL";
const GET_SPOT_DETAILS = "spots/DETAILS";
const CREATE_SPOT = "spots/CREATE";
const DELETE_SPOT = "spots/DELETE";
const ADD_IMAGE_TO_SPOT = "spots/ADD_IMAGE";
const UPDATE_SPOT = "spots/UPDATE";
const USER_SPOTS = "spots/USER_SPOTS";

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

const _createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

const _deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

const _addImageToSpot = (image) => {
  return {
    type: ADD_IMAGE_TO_SPOT,
    image,
  };
};

const _updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot,
  };
};

const _getUserSpots = (spots) => {
  return {
    type: USER_SPOTS,
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

  const errors = await response.json();
  return errors;
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const SpotDetails = await response.json();

    const SpotImages = {};
    SpotDetails.SpotImages.forEach((img) => (SpotImages[img.id] = img));

    const spotDetails = { ...SpotDetails, SpotImages };

    dispatch(_getSpotDetails(spotDetails));

    return spotDetails;
  }

  const errors = await response.json();
  return errors;
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(_createSpot(spot));

    return spot;
  }

  const errors = await response.json();
  return errors;
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const resopnse = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (resopnse.ok) {
    const { message } = await resopnse.json();
    dispatch(_deleteSpot(spotId));

    return message;
  }

  const errors = await resopnse.json();
  return errors;
};

export const addImageToSpot = (spotId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(image),
  });

  if (response.ok) {
    const image = await response.json();
    dispatch(_addImageToSpot(image));

    return image;
  }

  const errors = response.json();
  return errors;
};

export const updateSpot = (spotId, spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const spot = await response.json();
    dispatch(_updateSpot(spot));

    return spot;
  }

  const errors = await response.json();
  return errors;
};

export const getUserSpots = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);

  if (response.ok) {
    const { Spots } = await response.json();

    const spots = {};
    Spots.forEach((spot) => (spots[spot.id] = spot));

    dispatch(_getUserSpots(spots));

    return spots;
  }

  const errors = await response.json();
  return errors;
};

// ---REDUCER--- \\
const spotReducer = (
  state = { spotList: {}, spotDetails: {}, userSpots: {} },
  action
) => {
  switch (action.type) {
    case GET_SPOTS: {
      return { ...state, spotList: { ...state.spotList, ...action.spots } };
    }

    case GET_SPOT_DETAILS:
      return {
        ...state,
        spotDetails:
          // ...state.spotDetails,
          // [action.spotDetails.id]: action.spotDetails,
          action.spotDetails,
      };

    case CREATE_SPOT: {
      return {
        ...state,
        spotList: { ...state.spotList, [action.spot.id]: action.spot },
      };
    }

    case DELETE_SPOT: {
      const spotList = { ...state.spotList };
      delete spotList[action.spotId];
      return { ...state, spotList };
    }

    case ADD_IMAGE_TO_SPOT: {
      const spotDetails = {
        ...state.spotDetails,
        SpotImages: {
          ...state.spotDetails.SpotImages,
          [action.image.id]: { ...action.image },
        },
      };
      return { ...state, spotDetails: { ...spotDetails } };
    }

    case UPDATE_SPOT: {
      return {
        ...state,
        spotList: { ...state.spotList, [action.spot.id]: action.spot },
      };
    }

    case USER_SPOTS: {
      return { ...state, userSpots: action.spots };
    }

    default:
      return state;
  }
};

export default spotReducer;
