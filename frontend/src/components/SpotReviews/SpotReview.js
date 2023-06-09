import { useModal } from "../../context/Modal";
import ConfirmDelete from "../ManageSpots/ConfirmDelete";
import ReviewModal from "./ReviewModal";

const SpotReview = ({ userId, review, type }) => {
  const { setModalContent } = useModal();

  const [year, month] = review.createdAt.split("-");
  const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  return (
    <div className="review-body">
      <h3 style={{ marginTop: "5px" }}>
        {type === "spot" ? review.User.firstName : review.Spot?.name}
      </h3>

      <p className="date">
        {months[Number(month)]} {year}
      </p>

      <p style={{ fontSize: "small", marginBottom: "10px" }}>
        "{review.review}"
      </p>

      <div>
        {userId === review.userId && (
          <div style={{ marginBottom: "10px" }}>
            <button
              onClick={() =>
                setModalContent(
                  <ReviewModal
                    type={"Review"}
                    review={review}
                    spotId={review.spotId}
                  />
                )
              }
            >
              Update
            </button>

            <button
              onClick={() =>
                setModalContent(
                  <ConfirmDelete
                    type={"Review"}
                    reviewId={review.id}
                    spotId={review.spotId}
                  />
                )
              }
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotReview;
