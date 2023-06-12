import BookingModal from "../BookingModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const Booking = ({ spot }) => {
  return (
    <div className="booking">
      <p>
        <span>${Number(spot.price).toFixed(0)} </span> night
      </p>

      <p>
        <i className="fa-solid fa-star" style={{ color: "#808080" }} />
        {spot.avgStarRating
          ? `${Number(spot.avgStarRating).toFixed(1)} • ${
              spot.numReviews
            } review${Number(spot.numReviews) !== 1 ? "s" : ""}`
          : "New"}
      </p>

      <button>
        <OpenModalMenuItem
          itemText="Reserve"
          modalComponent={<BookingModal spot={spot} />}
        />
      </button>
    </div>
  );
};

export default Booking;
