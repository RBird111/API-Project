import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./ManageReviews.scss";
import { getUserReviews } from "../../store/reviews";
import SpotReview from "../SpotReviews/SpotReview";

const ManageReviews = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.userReviews);

  useEffect(() => {
    dispatch(getUserReviews());
  }, [dispatch]);

  if (Object.values(reviews).length === 0) return null;

  return (
    <div className="manage-reviews-page">
      <h1>Manage Reviews</h1>

      {Object.values(reviews).map((review) => (
        <SpotReview
          key={review?.id}
          type={"user"}
          userId={user?.id}
          review={review}
        />
      ))}
    </div>
  );
};

export default ManageReviews;
