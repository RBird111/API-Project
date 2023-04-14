import { useDispatch } from "react-redux";
import { deleteSpot, getSpotDetails, getUserSpots } from "../../store/spot";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

const ConfirmDelete = ({ type, reviewId, spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className="confirm-delete">
      <h2>Confirm Delete</h2>

      {type === "Spot" ? (
        <p>Are you sure you want to remove this spot from the listings?</p>
      ) : type === "Review" ? (
        <p>Are you sure you want to delete this review?</p>
      ) : null}

      <button
        className="yes"
        onClick={async () => {
          if (type === "Spot") {
            await dispatch(deleteSpot(spotId));
            await dispatch(getUserSpots());
          }

          if (type === "Review") {
            await dispatch(deleteReview(reviewId));
            await dispatch(getSpotDetails(spotId));
          }

          closeModal();
        }}
      >
        Yes (Delete {type})
      </button>

      <button className="no" onClick={closeModal}>
        No (Keep {type})
      </button>
    </div>
  );
};

export default ConfirmDelete;
