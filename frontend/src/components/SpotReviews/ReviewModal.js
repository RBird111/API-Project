import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview, getSpotReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { getSpotDetails } from "../../store/spot";

const ReviewModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [input, setInput] = useState("");

  // Rating that gets reported
  const [rating, setRating] = useState(0);

  // Rating that the slider uses
  const [activeRating, setActiveRating] = useState(rating);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating)
      setErrors({ rating: "Please provide a rating for your review." });
    else setErrors({});

    const review = {
      review: input,
      stars: rating,
    };

    const res = await dispatch(createReview(spotId, review));

    if (!res.errors) {
      // console.log(ret.id);
      await dispatch(getSpotDetails(spotId));
      await dispatch(getSpotReviews(spotId));
      closeModal();
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
      <h2>How was your stay?</h2>
      <form onSubmit={handleSubmit}>
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

        <div>{errors?.rating && <p className="errors">{errors.rating}</p>}</div>

        <button
          className="submit-button"
          disabled={input.length < 10}
          onMouseEnter={() => setActiveRating(rating)}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
