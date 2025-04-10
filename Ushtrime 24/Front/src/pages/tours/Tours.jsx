import React, { useEffect, useState } from "react";
// import TourCard from "../components/TourCard";
import TourCard from "../../components/TourCard";
import AddTourModal from "../../components/AddTourModal";
import styles from "../../styles/Tours.module.css";
import api from "../../auth/api";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTours = async () => {
    try {
      const res = await api.get("/tours");
      setTours(res.data);
    } catch (error) {
      console.error("Error fetching tours", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Travel Destinations</h1>
      <button onClick={() => setShowModal(true)} className={styles.addButton}>
        + Add New Tour
      </button>

      <ul className={styles.cards}>
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </ul>

      {showModal && (
        <AddTourModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchTours}
        />
      )}
    </div>
  );
};

export default Tours;
