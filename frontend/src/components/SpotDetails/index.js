import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getSpotDetails } from "../../store/spot";
import "./SpotDetails.scss";
import SpotReviews from "../SpotReviews";
import { getSpotReviews } from "../../store/reviews";

const SpotDetails = () => {
  const dispatch = useDispatch();

  const { spotId } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
      .then(() => dispatch(getSpotReviews(spotId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spots.spotDetails);

  return (
    <>
      <div className="spot-details">
        {isLoaded && (
          <>
            <div>
              <h1>{spot.name}</h1>
              <p>
                {spot.city}, {spot.state}, {spot.country}
              </p>
            </div>
            <div className="spot-images">
              <img
                className="preview-img"
                src={
                  Object.values(spot.SpotImages).find(
                    (img) => img.preview === true
                  )?.url
                }
                alt="spot"
              />

              <div className="img-container">
                {/* TODO replace placeholders */}
                {[1, 2, 3].map((num) => (
                  <img
                    key={num}
                    className={`i${num}`}
                    src={`https://picsum.photos/4${num}0/3${num}0`}
                    alt="placeholder"
                  />
                ))}
              </div>
            </div>

            <div className="spot-detail">
              <div className="description">
                <h2>
                  Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                </h2>

                <p>{spot.description}</p>
              </div>

              <div className="booking">
                <p>
                  <span>${Number(spot.price).toFixed(0)} </span> night
                </p>

                <p>
                  <i
                    className="fa-solid fa-star"
                    style={{ color: "#808080" }}
                  />
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
            </div>

            <div className="reviews">
              <SpotReviews spot={spot} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SpotDetails;
