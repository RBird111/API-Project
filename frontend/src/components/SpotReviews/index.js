import { useSelector } from "react-redux";

import "./SpotReviews.scss";
import SpotReview from "./SpotReview";
import { useModal } from "../../context/Modal";
import ReviewModal from "./ReviewModal";

const SpotReviews = ({ spot }) => {
  const reviews = useSelector((state) => state.reviews.spotReviews);
  const user = useSelector((state) => state.session.user);

  const { setModalContent } = useModal();

  const allowButton = (user, reviews) => {
    const hasReview = Object.values(reviews).find(
      (review) => review.userId === user.id
    );

    const ownsSpot = spot.ownerId === user.id;

    if (hasReview || ownsSpot) return false;
    else return true;
  };

  return (
    <div className="spot-reviews-container">
      <h2>
        <i className="fa-solid fa-star" style={{ color: "#808080" }} />
        {spot.avgStarRating
          ? `${Number(spot.avgStarRating).toFixed(1)} • ${
              spot.numReviews
            } review${spot.numReviews !== 1 ? "s" : ""}`
          : "New"}
      </h2>

      <div>
        {user && allowButton(user, reviews) && Object.values(reviews) && (
          // TODO ADD BUTTON FUNCTIONALITY
          <>
            <button
              className="post-review"
              onClick={() => setModalContent(<ReviewModal spotId={spot.id} />)}
            >
              Post Your Review
            </button>
            {Object.values(reviews).length === 0 && (
              <h3 style={{ marginTop: "0" }}>Be the first to post a review!</h3>
            )}
          </>
        )}
      </div>

      {Object.values(reviews).map((review) => (
        <SpotReview id={user.id} key={review.id} review={review} />
      ))}
    </div>
  );
};

export default SpotReviews;
