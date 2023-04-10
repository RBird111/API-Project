import { useSelector } from "react-redux";

import SpotCard from "../SpotCard";
import "./AllSpots.scss";
import { NavLink } from "react-router-dom";

const AllSpots = () => {
  const spots = useSelector((state) => state.spots.spotList);

  return (
    <div className="all-spots">
      {Object.values(spots).map((spot) => (
        <NavLink
          className={`spot-card-link`}
          key={spot.id}
          to={`/spots/${spot.id}`}
        >
          <SpotCard spot={spot} />
        </NavLink>
      ))}
    </div>
  );
};

export default AllSpots;
