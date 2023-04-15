import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "./SpotDetails.scss";
import SpotReviews from "../SpotReviews";
import { getSpotDetails } from "../../store/spot";
import { getSpotReviews } from "../../store/reviews";
import SpotImages from "./SpotImages";
import Booking from "./Booking";

const SpotDetails = () => {
  const dispatch = useDispatch();

  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots.spotDetails);

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (Object.values(spot).length === 0) return null;

  return (
    <div className="spot-details">
      <>
        <div>
          <h1>{spot.name}</h1>
          <p>
            {spot.city}, {spot.state}, {spot.country}
          </p>
        </div>

        {/* Display spot images */}
        <SpotImages spot={spot} />

        <div className="spot-detail">
          <div className="description">
            <h2>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h2>

            <p>{spot.description}</p>
          </div>

          {/* Display booking feature */}
          <Booking spot={spot} />
        </div>

        <div className="reviews">
          {/* Display spot reviews */}
          <SpotReviews spot={spot} />
        </div>
      </>
    </div>
  );
};

export default SpotDetails;
