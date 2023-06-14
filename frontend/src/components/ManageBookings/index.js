import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getUserBookings } from "../../store/bookings";
import { useModal } from "../../context/Modal";
import BookingModal, { formatDate } from "../BookingModal";
import "./ManageBookings.scss";
import { NavLink } from "react-router-dom";

const BookingCard = ({ booking, user }) => {
  const { startDate, endDate } = booking;
  const spot = booking.Spot;
  const { setModalContent } = useModal();

  return (
    <div className="bkc-wrap">
      <NavLink to={`/spots/${spot.id}`}>
        <div className="booking-card">
          <h2>Booking for {spot.name}</h2>

          <img src={spot.previewImage} alt="spot preview" />

          <p className="arrive">
            Arrive: <span>{formatDate(startDate)}</span>
          </p>
          <p>
            Depart: <span>{formatDate(endDate)}</span>
          </p>
        </div>
      </NavLink>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          className="update-btn"
          onClick={(e) =>
            setModalContent(
              <BookingModal spot={spot} user={user} bookingData={booking} />
            )
          }
        >
          Update
        </button>
      </div>
    </div>
  );
};

const ManageBookings = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);

  const today = new Date();
  const userBookings = useSelector((state) => state.bookings.userBookings);
  const bookings = Object.values(userBookings)
    .filter((booking) => today <= new Date(booking.endDate))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getUserBookings()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return <>Loading...</>;

  return (
    <div className="manage-bookings">
      <h1>Manage Bookings</h1>

      <div className="booking-wrap">
        {bookings.length !== 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} user={user} booking={booking} />
          ))
        ) : (
          <p>You Haven't Booked Anything Yet!</p>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
