import React, { useState } from "react";
import styles from "../styles/Tours.module.css";
import BookingModal from "./BookingModal";

const TourCard = ({ tour }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { title, country, city, location, averageReating, price, image } = tour;

  const fullImageUrl = image?.startsWith("uploads")
    ? `http://localhost:3000/${image}`
    : image || "https://via.placeholder.com/300x200?text=No+Image";

  const handleBookingSuccess = () => {
    // You can add a toast notification here
    console.log("Booking successful!");
  };

  return (
    <>
      <li className={styles.cards_item}>
        <div className={styles.card}>
          <div className={styles.card_image}>
            <img src={fullImageUrl} alt={title} />
          </div>
          <div className={styles.card_content}>
            <h2 className={styles.card_title}>{title}</h2>
            <p className={styles.card_text}>
              <strong>Country:</strong> {country}
              <br />
              <strong>City:</strong> {city}
              <br />
              <strong>Location:</strong> {location}
              <br />
              <strong>Rating:</strong> {averageReating} ⭐<br />
              <strong>Price:</strong> ${price}
            </p>
            <button
              className={styles.btn}
              onClick={() => setShowBookingModal(true)}
            >
              Book
            </button>
          </div>
        </div>
      </li>
      {showBookingModal && (
        <BookingModal
          tour={tour}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default TourCard;
