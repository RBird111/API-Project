import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useModal } from "../../context/Modal";
import "./BookingModal.scss";
import {
  createBooking,
  editBooking,
  getSpotBookings,
} from "../../store/bookings";
import ConfirmDelete from "../ManageSpots/ConfirmDelete";

const getTommorow = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 1);
  return date;
};

export const formatDate = (date) => {
  let str = new Date(date).toISOString();
  // [[%Y], [%M], [%D]]
  str = str.split("T")[0].split("-");
  // "%M/%D/%Y"
  return [str[1], str[2], str[0]].join("/");
};

const BookingModal = ({ spot, user, bookingData }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal, setModalContent } = useModal();

  const today = new Date();

  let bookings = useSelector((state) => state.bookings.spotBookings);
  bookings = Object.values(bookings)
    .filter((booking) => new Date(booking.endDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.endDate));

  if (bookingData) delete bookings[bookingData.id];

  const [startDate, setStartDate] = useState(today);
  const [tomorrow, setTomorrow] = useState(getTommorow(today));
  const [endDate, setEndDate] = useState(tomorrow);
  const [errors, setErrors] = useState({});

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (bookingData) {
      setStartDate(new Date(bookingData.startDate));
      setEndDate(new Date(bookingData.endDate));
    }
  }, [bookingData]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const booking = () => {
      if (bookingData)
        return {
          ...bookingData,
          startDate,
          endDate,
        };

      return {
        startDate,
        endDate,
      };
    };

    try {
      if (bookingData) await dispatch(editBooking(booking()));
      else await dispatch(createBooking(spot.id, booking()));
      history.push("/bookings/current");
    } catch (e) {
      let err = await e.json();
      return setErrors(err.errors);
    }

    closeModal();
  };

  if (!isLoaded) return <div style={{ padding: "10px" }}>Loading...</div>;

  return (
    <div className="booking-modal">
      {!bookingData ? <h1>{spot.name} Booking</h1> : <h1>Update Booking</h1>}

      <div className="existing-bookings">
        <p className="b-title">Reserved Dates:</p>
        {bookings.length !== 0 ? (
          bookings.map((booking) => (
            <p
              key={booking.id}
              className={user.id === booking.userId ? "owned" : ""}
            >
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
              {user && user.id === booking.userId && (
                <>
                  {!bookingData && (
                    <i
                      onClick={(e) => {
                        setModalContent(
                          <BookingModal
                            spot={spot}
                            user={user}
                            bookingData={booking}
                          />
                        );
                      }}
                      className="fa-solid fa-pen-to-square"
                    />
                  )}
                  <i
                    onClick={(e) =>
                      setModalContent(
                        <ConfirmDelete
                          type={"Booking"}
                          bookingId={booking.id}
                        />
                      )
                    }
                    className="fa-solid fa-trash"
                  />
                </>
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

        <button type="submit">{!bookingData ? "Reserve" : "Update"}</button>
      </form>
    </div>
  );
};

export default BookingModal;
