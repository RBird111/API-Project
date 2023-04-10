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

  const spotDetails = useSelector((state) => state.spots.spotDetails);

  // Spot details
  let spot;
  if (isLoaded) spot = spotDetails[spotId];

  // Spot preview image
  let imgUrl;
  if (isLoaded)
    imgUrl = Object.values(spot.SpotImages).find(
      (obj) => obj.preview === true
    ).url;

  return (
    <>
      <div className="spot-details">
        {isLoaded && (
          <>
            <div className="spot-images">
              <img className="preview-img" src={imgUrl} alt="spot" />

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

              <div className="spot-detail"></div>
            </div>

            <div className="spot-desc"></div>

            <div className="reserve-btn"></div>

            <div className="reviews"></div>
          </>
        )}
      </div>
    </>
  );
};

export default SpotDetails;
