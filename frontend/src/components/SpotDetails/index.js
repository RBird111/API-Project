import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getSpotDetails } from "../../store/spot";
import "./SpotDetails.scss";
import SpotReviews from "../SpotReviews";
import { getSpotReviews } from "../../store/reviews";

const SpotDetails = () => {
  const dispatch = useDispatch();

  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots.spotDetails);

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
    dispatch(getSpotReviews(spotId))
  }, [dispatch, spotId]);

  if (!spot) return null

  return (
    <div className="spot-details">
      <>
        <div>
          <h1>{spot.name}</h1>
          <p>
            {spot.city}, {spot.state}, {spot.country}
          </p>
        </div>

        {/* Seperate into component */}
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
            {Object.values(spot.SpotImages)
              .filter((img) => img.preview === false)
              .map((image, idx) => (
                <div key={image.id}>
                  <img
                    key={image.id}
                    alt="spot"
                    className={`i${idx}`}
                    src={image.url}
                  />
                </div>
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
                ? `${Number(spot.avgStarRating).toFixed(1)} • ${spot.numReviews
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
      )
    </div>
  );
};

export default SpotDetails;
