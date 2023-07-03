import { useDispatch, useSelector } from "react-redux";

import "./AllSpots.scss";
import SpotCard from "../SpotCard";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots, searchSpots } from "../../store/spot";

const AllSpots = ({ isSearch, setIsSearch }) => {
  const dispatch = useDispatch();
  const { query, search } = isSearch;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (search) {
      dispatch(searchSpots({ query }))
        .then(() => setIsSearch({ query: "", search: false }))
        .then(() => setIsLoaded(true));
    } else {
      dispatch(getAllSpots()).then(() => setIsLoaded(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
