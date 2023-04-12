import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getSpotDetails } from "../../store/spot";
import "./SpotDetails.scss";

const SpotDetails = () => {
  const dispatch = useDispatch();

  const { spotId } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetails(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spots.spotDetails);

  return (
    <>
      <div className="spot-details">
        {isLoaded && (
          <>
            <div>
              <h1>{spot.name}</h1>
              <p>{spot.city}, {spot.state}, {spot.country}</p>
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
                  <span>${spot.price}</span> night
                </p>

                <p>
                  <i className="fa-solid fa-star" style={{ color: "#000" }} />
                  {spot.avgStarRating
                    ? Number(spot.avgStarRating).toFixed(1)
                    : "New"}{" "}
                  &#x2022; {spot.numReviews} review
                  {spot.numReviews !== 1 && "s"}
                </p>

                <button onClick={() => alert("Feature not yet implemented")}>
                  Reserve
                </button>
              </div>
            </div>

            <div className="reviews"></div>
          </>
        )}
      </div>
    </>
  );
};

export default SpotDetails;
