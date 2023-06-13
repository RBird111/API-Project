import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./BookingModal.scss";
import {
  createBooking,
  deleteBooking,
  getSpotBookings,
} from "../../store/bookings";
import { useModal } from "../../context/Modal";

const getTommorow = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 1);
  return date;
};

const BookingModal = ({ spot, user }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const today = new Date();

  let bookings = useSelector((state) => state.bookings.spotBookings);
  bookings = Object.values(bookings).filter(
    (booking) => new Date(booking.endDate) >= today
  );

  const [startDate, setStartDate] = useState(today);
  const [tomorrow, setTomorrow] = useState(getTommorow(today));
  const [endDate, setEndDate] = useState(tomorrow);
  const [errors, setErrors] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  // Updates the minimum end date
  useEffect(() => {
    setTomorrow(getTommorow(startDate));
  }, [startDate]);

  useEffect(() => {
    if (endDate < tomorrow) setEndDate(tomorrow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tomorrow]);

  useEffect(() => {
    dispatch(getSpotBookings(spot.id)).then(() => setIsLoaded(true));
  }, [dispatch, spot.id]);

  const handleDelete = async (e, bookingId) => {
    e.preventDefault();

    try {
      await dispatch(deleteBooking(bookingId));
      await dispatch(getSpotBookings(spot.id));
    } catch (e) {
      let err = await e.json();
      return setErrors(err.errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const booking = {
      startDate,
      endDate,
    };

    try {
      await dispatch(createBooking(spot.id, booking));
    } catch (e) {
      let err = await e.json();
      return setErrors(err.errors);
    }

    closeModal();
  };

  if (!isLoaded) return <div style={{ padding: "10px" }}>Loading...</div>;

  return (
    <div className="booking-modal">
      <h1>{spot.name} Booking</h1>

      <div className="existing-bookings">
        <p className="b-title">Dates already booked:</p>
        {bookings.length !== 0 ? (
          bookings.map((booking) => (
            <p key={booking.id}>
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
              {user && user.id === booking.userId && (
                <i
                  onClick={(e) => handleDelete(e, booking.id)}
                  className="fa-solid fa-trash"
                />
              )}
            </p>
          ))
        ) : (
          <p>Choose any dates you'd like!</p>
        )}
      </div>

      {errors &&
        Object.values(errors).map((error) => (
          <p className="error" key={error}>
            {error}
          </p>
        ))}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Start Date
            <input
              type="date"
              name="start"
              min={today.toISOString().split("T")[0]}
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              name="end"
              min={tomorrow.toISOString().split("T")[0]}
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </label>
        </div>

        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default BookingModal;
