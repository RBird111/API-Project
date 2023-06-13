import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getUserBookings } from "../../store/bookings";
import { useModal } from "../../context/Modal";
import BookingModal, { formatDate } from "../BookingModal";
import "./ManageBookings.scss";

const ManageBookings = () => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const user = useSelector((state) => state.session.user);

  const today = new Date();
  const userBookings = useSelector((state) => state.bookings.userBookings);
  const bookings = Object.values(userBookings).filter(
    (booking) => today <= new Date(booking.endDate)
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getUserBookings()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return <>Loading...</>;

  return (
    <div className="manage-bookings">
      <h1>Manage Bookings</h1>

      {bookings.length !== 0 ? (
        bookings.map((booking) => (
          <div key={booking.id}>
            <h2>Booking for {booking.Spot.name}</h2>

            <p>
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              <i
                onClick={(e) => {
                  setModalContent(
                    <BookingModal
                      spot={booking.Spot}
                      user={user}
                      bookingData={booking}
                    />
                  );
                }}
                className="fa-solid fa-pen-to-square"
              />
            </p>
          </div>
        ))
      ) : (
        <p>You Haven't Booked Anything Yet!</p>
      )}
    </div>
  );
};

export default ManageBookings;
