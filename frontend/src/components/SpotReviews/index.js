import { useSelector } from "react-redux";

import "./SpotReviews.scss";
import SpotReview from "./SpotReview";

const SpotReviews = () => {
  const reviews = useSelector((state) => state.reviews.spotReviews);

  return (
    <div className="spot-reviews-container">
      {Object.values(reviews).length > 0 ? (
        <h1>We have Reviews</h1>
      ) : (
        <h1>New</h1>
      )}

      {Object.values(reviews).map((review) => (
        <SpotReview key={review.id} review={review} />
      ))}
    </div>
  );
};

export default SpotReviews;
