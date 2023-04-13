import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import "./ManageSpots.scss";
import { getUserSpots } from "../../store/spot";
import SpotCard from "../SpotCard";
import { useModal } from "../../context/Modal";
import ConfirmDelete from "./ConfirmDelete";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getUserSpots()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const spots = useSelector((state) => state.spots.userSpots);

  return (
    <div className="manage-spots">
      <div className="manage-header">
        <h1>Manage Your Spots</h1>

        <NavLink to={"/spots/new"}>
          <button>Create a New Spot</button>
        </NavLink>
      </div>

      {isLoaded &&
        Object.values(spots).map((spot) => (
          <div key={spot.id}>
            <NavLink className={"spot-card-link"} to={`/spots/${spot.id}`}>
              <SpotCard spot={spot} />
            </NavLink>

            <div className="manage-buttons">
              <NavLink to={`/spots/${spot.id}/edit`}>
                <button>Update</button>
              </NavLink>

              <button
                onClick={() =>
                  setModalContent(<ConfirmDelete spotId={spot.id} />)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ManageSpots;
