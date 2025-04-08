import React, { useState } from "react";
import styles from "../styles/Tours.module.css";
import api from "../auth/api";

const AddTourModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    city: "",
    price: "",
    averageReating: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in form) {
      data.append(key, form[key]);
    }
    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);
      await api.post("/tours", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding tour:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add New Tour</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input
            placeholder="Title"
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            required
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Location"
            required
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            placeholder="Country"
            required
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <input
            placeholder="City"
            required
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            required
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Average Rating"
            type="number"
            step="0.1"
            required
            onChange={(e) =>
              setForm({ ...form, averageReating: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className={styles.modalActions}>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTourModal;
