import "./SpotCard.scss";

const SpotCard = ({ spot }) => {
  return (
    <div className="spot-card">
      <img src={spot.previewImage} alt="placeholder" />
      <div>
        <p>
          {spot.city}, {spot.state}
        </p>

        <p>
          <i className="fa-solid fa-star" style={{ color: "#808080" }} />
          {Number(spot.avgRating) ? Number(spot.avgRating).toFixed(1) : "New"}
        </p>
      </div>

      <p>
        <span style={{ fontWeight: "bold" }}>
          ${Number(spot.price).toFixed(0)}
        </span>{" "}
        night
      </p>
    </div>
  );
};

export default SpotCard;
