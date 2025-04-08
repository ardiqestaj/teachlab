import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../auth/api";
import styles from "../styles/Tours.module.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({
  tour,
  onSuccess,
  onClose,
  clientSecret,
  bookingData,
  setBookingData,
  bookingId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Update the booking with the final guest count and date
      await api.put(`/bookings/${bookingId}`, {
        guests: bookingData.guests,
        date: bookingData.date,
      });

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings`,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Number of Guests:</label>
        <input
          type="number"
          min="1"
          value={bookingData.guests}
          onChange={(e) =>
            setBookingData({ ...bookingData, guests: parseInt(e.target.value) })
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Date:</label>
        <input
          type="date"
          value={bookingData.date}
          onChange={(e) =>
            setBookingData({ ...bookingData, date: e.target.value })
          }
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Total Amount: ${tour.price * bookingData.guests}</label>
      </div>
      <PaymentElement />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.modalActions}>
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const BookingModal = ({ tour, onClose, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    guests: 1,
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post(`/bookings/${tour._id}/book`, {
          guests: bookingData.guests,
          date: bookingData.date,
        });
        setClientSecret(response.data.clientSecret);
        setBookingId(response.data.booking._id);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [tour._id]);

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Loading payment form...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Error</h2>
          <p className={styles.error}>{error}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Book {tour.title}</h2>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            tour={tour}
            onSuccess={onSuccess}
            onClose={onClose}
            clientSecret={clientSecret}
            bookingData={bookingData}
            setBookingData={setBookingData}
            bookingId={bookingId}
          />
        </Elements>
      </div>
    </div>
  );
};

export default BookingModal;
