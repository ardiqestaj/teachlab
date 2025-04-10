import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../auth/api";
import styles from "../../styles/Tours.module.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/myBookings");
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Get payment intent and status from URL parameters
  const paymentIntent = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  useEffect(() => {
    const updateBookingStatus = async () => {
      if (paymentIntent && redirectStatus === "succeeded") {
        console.log("Payment successful, updating booking status...");
        try {
          // Find the booking with matching paymentIntentId
          const bookingToUpdate = bookings.find(
            (booking) => booking.paymentIntentId === paymentIntent
          );

          console.log("Found booking to update:", bookingToUpdate);

          if (bookingToUpdate) {
            // Only update if the booking is still pending
            if (bookingToUpdate.status === "pending") {
              // Update the booking status
              const response = await api.put(
                `/bookings/${bookingToUpdate._id}/confirm`
              );
              console.log("Booking confirmation response:", response.data);

              // Update the bookings list
              setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                  booking._id === bookingToUpdate._id
                    ? { ...booking, status: "confirmed" }
                    : booking
                )
              );
            } else {
              console.log(
                "Booking is already confirmed:",
                bookingToUpdate.status
              );
            }

            // Clear the URL parameters
            navigate("/bookings", { replace: true });
          } else {
            console.log(
              "No booking found with paymentIntentId:",
              paymentIntent
            );
          }
        } catch (error) {
          console.error("Error updating booking status:", error);
        }
      }
    };

    updateBookingStatus();
  }, [paymentIntent, redirectStatus, navigate, bookings]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}/cancel`);
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "canceled" }
            : booking
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return <div className={styles.wrapper}>Loading bookings...</div>;
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You don't have any bookings yet.</p>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <h3>{booking.tour.title}</h3>
              <p>
                <strong>Location:</strong> {booking.tour.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Guests:</strong> {booking.guests}
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {booking.tour.price * booking.guests}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={styles[booking.status]}>{booking.status}</span>
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span className={styles[booking.paymentStatus]}>
                  {booking.paymentStatus}
                </span>
              </p>
              {booking.status === "pending" && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className={styles.cancelButton}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
