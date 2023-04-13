import { useDispatch } from "react-redux";
import { deleteSpot, getUserSpots } from "../../store/spot";
import { useModal } from "../../context/Modal";

const ConfirmDelete = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <div className="confirm-delete">
      <h2>Confirm Delete</h2>

      <p>Are you sure you want to remove this spot from the listings?</p>

      <button
        className="yes"
        onClick={async () => {
          await dispatch(deleteSpot(spotId));
          await dispatch(getUserSpots());
          closeModal();
        }}
      >
        Yes (Delete Spot)
      </button>

      <button className="no" onClick={closeModal}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default ConfirmDelete;
