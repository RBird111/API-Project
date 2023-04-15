import { csrfFetch } from "./csrf";

// ---TYPES--- \\
const USER_REVIEWS = "reviews/USER";
const SPOT_REVIEWS = "reviews/SPOT";
const CREATE_REVIEW = "reviews/CREATE";
const DELETE_REVIEW = "reviews/DELETE";
const EDIT_REVIEW = "reviews/EDIT";

// ---ACTIONS--- \\
const _getUserReviews = (reviews) => {
  return {
    type: USER_REVIEWS,
    reviews,
  };
};

const _getSpotReviews = (reviews) => {
  return {
    type: SPOT_REVIEWS,
    reviews,
  };
};

const _createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

const _deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
  };
};

const _editReview = (review) => {
  return {
    type: EDIT_REVIEW,
    review,
  };
};

// ---ACTION DISPATCHERS--- \\
export const getUserReviews = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");

  // Place at end of code use gaurd for fail case and handle normalization in the reducer, not thunk
  if (response.ok) {
    const { Reviews } = await response.json();

    const reviews = {};
    Reviews.forEach((review) => {
      const { ReviewImages } = review;
      const reviewImages = {};
      ReviewImages.forEach((img) => (reviewImages[img.id] = img));

      reviews[review.id] = { ...review, ReviewImages: reviewImages };
    });

    dispatch(_getUserReviews(reviews));

    return reviews;
  }

  const errors = await response.json();
  return errors;
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const { Reviews } = await response.json();

    const reviews = {};
    Reviews.forEach((review) => {
      const { ReviewImages } = review;
      const reviewImages = {};
      ReviewImages.forEach((img) => (reviewImages[img.id] = img));

      reviews[review.id] = { ...review, ReviewImages: reviewImages };
    });

    dispatch(_getSpotReviews(reviews));

    return reviews;
  }

  const errors = await response.json();
  return errors;
};

export const createReview = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(_createReview(review));

    return review;
  }

  const errors = await response.json();
  return errors;
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const { message } = await response.json();
    dispatch(_deleteReview(reviewId));

    return message;
  }

  const errors = await response.json();
  return errors;
};

export const editReview = (review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${review.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const review = await response.json();
    dispatch(_editReview(review));

    return review;
  }

  const errors = await response.json();
  return errors;
};

// ---REDUCER--- \\
const initialState = { userReviews: {}, spotReviews: {} };

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REVIEWS: {
      return { ...state, userReviews: action.reviews };
    }

    case SPOT_REVIEWS: {
      return { ...state, spotReviews: action.reviews };
    }

    case CREATE_REVIEW: {
      return { ...state, currReview: action.review };
    }

    case DELETE_REVIEW: {
      const spotReviews = { ...state.spotReviews };
      if (spotReviews[action.reviewId]) delete spotReviews[action.reviewId];

      const userReviews = { ...state.userReviews };
      if (userReviews[action.reviewId]) delete userReviews[action.reviewId];

      return { ...state, spotReviews, userReviews };
    }

    case EDIT_REVIEW: {
      return {
        ...state,
        userReviews: {
          ...state.userReviews,
          [action.review.id]: action.review,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default reviewReducer;
