import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./BookingModal.scss";
import { getSpotBookings } from "../../store/bookings";

const getTommorow = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 1);
  return date;
};

const BookingModal = ({ spot }) => {
  const dispatch = useDispatch();

  const today = new Date();

  const bookings = useSelector((state) => state.bookings.spotBookings);

  const [startDate, setStartDate] = useState(today);
  const [tomorrow, setTomorrow] = useState(getTommorow(today));
  const [endDate, setEndDate] = useState(tomorrow);

  const [isLoaded, setIsLoaded] = useState(false);

  // Updates the minimum end date
  useEffect(() => {
    setTomorrow(getTommorow(startDate));
  }, [startDate]);

  useEffect(() => {
    dispatch(getSpotBookings(spot.id)).then(() => setIsLoaded(true));
  }, [dispatch, spot.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (!isLoaded) return <div style={{ padding: "10px" }}>Loading...</div>;

  return (
    <div className="booking-modal">
      <h1>{spot.name} Booking</h1>

      <div className="existing-bookings">
        <p className="b-title">Dates already booked:</p>
        {Object.values(bookings).length !== 0 ? (
          Object.values(bookings).map((booking) => (
            <p key={booking.id}>
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
          ))
        ) : (
          <p>Choose any dates you'd like!</p>
        )}
      </div>

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
              value={
                endDate > startDate
                  ? endDate.toISOString().split("T")[0]
                  : tomorrow.toISOString().split("T")[0]
              }
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
