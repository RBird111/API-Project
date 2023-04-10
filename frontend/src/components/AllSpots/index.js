import { useSelector } from "react-redux";

import SpotCard from "../SpotCard";
import "./AllSpots.scss";

const AllSpots = () => {
  const spots = useSelector((state) => state.spots);

  return (
    <div className="all-spots">
      {Object.values(spots).map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  );
};

export default AllSpots;
