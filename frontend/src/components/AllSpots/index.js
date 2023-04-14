import { useDispatch, useSelector } from "react-redux";

import SpotCard from "../SpotCard";
import "./AllSpots.scss";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spot";

const AllSpots = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpots()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const spots = useSelector((state) => state.spots.spotList);

  if (!isLoaded) return null;

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
