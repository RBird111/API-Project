import "./SpotCard.scss";

const SpotCard = ({ spot }) => {
  return (
    <div className="spot-card">
      <img src="https://placekitten.com/400/300" alt="placeholder" />
      <div>
        <p>
          {spot.city}, {spot.state}
        </p>

        <p>
          <i className="fa-solid fa-star" style={{ color: "#ff5a5f" }} />
          {Number(spot.avgRating).toFixed(1)}
        </p>
      </div>

      <p>
        <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
      </p>
    </div>
  );
};

export default SpotCard;
