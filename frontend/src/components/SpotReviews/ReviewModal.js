import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  editReview,
  getSpotReviews,
  getUserReviews,
} from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { getSpotDetails } from "../../store/spot";

const ReviewModal = ({ spotId, review }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const spot = useSelector((state) => state.spots.spotList)[spotId];

  const [input, setInput] = useState(review ? review.review : "");

  // Rating that gets reported
  const [rating, setRating] = useState(review ? review.stars : 0);

  // Rating that the slider uses
  const [activeRating, setActiveRating] = useState(rating);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});

    if (!rating)
      setErrors({ rating: "Please provide a rating for your review." });

    if (input.length > 255)
      setErrors({ review: "Review cannot exceed 255 characters." });
    else if (input.length < 10)
      setErrors({ review: "Review must be at least 10 characters long." });
  }, [input, rating]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).length) return;

    const newReview = {
      review: input,
      stars: rating,
    };

    if (!review) {
      const res = await dispatch(createReview(spotId, newReview));

      if (!res.errors) {
        await dispatch(getSpotDetails(spotId));
        await dispatch(getSpotReviews(spotId));
        closeModal();
      }
    } else {
      newReview.id = review.id;
      const res = await dispatch(editReview(newReview));

      if (!res.errors) {
        await dispatch(getSpotDetails(spotId));
        await dispatch(getUserReviews());
        await dispatch(getSpotReviews(spotId));
        closeModal();
      }
    }
  };

  const StarIcon = ({ number }) => {
    const props = {};
    props.onMouseEnter = () => setActiveRating(number);
    props.onMouseLeave = () => setActiveRating(rating);
    props.onClick = () => setRating(number);

    return (
      // Star icons
      <div key={number} {...props}>
        <i
          className={`${
            activeRating >= number ? "fa-solid" : "fa-regular"
          } fa-star`}
          style={{ color: "#808080" }}
        />
      </div>
    );
  };

  return (
    <div className="post-review-div">
      <h2>How was your stay{review && ` at ${spot.name}`}?</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: "0", margin: "0" }}>
          {Object.values(errors).map((message) => (
            <p className="error">{message}</p>
          ))}
        </div>

        <textarea
          placeholder="Leave your review here..."
          value={input}
          autoFocus={true}
          onChange={(e) => setInput(e.target.value)}
          onMouseEnter={() => setActiveRating(rating)}
        />

        <div
          className="star-rating"
          onMouseLeave={() => setActiveRating(rating)}
        >
          {[1, 2, 3, 4, 5].map((number) => (
            <StarIcon key={number} number={number} />
          ))}
          <span>Stars</span>
        </div>

        <button
          className="submit-button"
          onMouseEnter={() => setActiveRating(rating)}
        >
          {review ? "Update" : "Submit"} Your Review
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
