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
            } review${spot.numReviews !== 1 ? "s" : ""}`
          : "New"}
      </p>

      <button onClick={() => alert("Feature not yet implemented")}>
        Reserve
      </button>
    </div>
  );
};

export default Booking;
