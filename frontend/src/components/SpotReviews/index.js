import { useSelector } from "react-redux";

import "./SpotReviews.scss";
import SpotReview from "./SpotReview";

const SpotReviews = ({ spot }) => {
  const reviews = useSelector((state) => state.reviews.spotReviews);
  const user = useSelector((state) => state.session.user);

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
          <button className="post-review">Post Your Review</button>
        )}
      </div>

      {Object.values(reviews).map((review) => (
        <SpotReview key={review.id} review={review} />
      ))}

      {Object.values(reviews).length === 0 && (
        <p>Be the first to post a review!</p>
      )}
    </div>
  );
};

export default SpotReviews;
