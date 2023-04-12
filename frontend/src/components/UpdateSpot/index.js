import { useEffect, useState } from "react";
import UpdateSpotPage from "./UpdateSpotPage";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spot";
import { useParams } from "react-router-dom";

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  const currSpot = useSelector((state) => state.spots.spotDetails);

  useEffect(() => {
    dispatch(getSpotDetails(spotId)).then(() => setIsLoaded(true));
  }, [dispatch, spotId]);

  if (!isLoaded) return null;

  return <UpdateSpotPage currSpot={currSpot} />;
};

export default UpdateSpot;
