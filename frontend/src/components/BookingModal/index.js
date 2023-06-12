import { useEffect, useState } from "react";
import "./BookingModal.scss";

const getTommorow = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 1);
  return date;
};

const BookingModal = ({ spot }) => {
  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [tomorrow, setTomorrow] = useState(getTommorow(today));
  const [endDate, setEndDate] = useState(tomorrow);

  useEffect(() => {
    setTomorrow(getTommorow(startDate));
  }, [startDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="booking-modal">
      <h1>{spot.name} Booking</h1>

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default BookingModal;
