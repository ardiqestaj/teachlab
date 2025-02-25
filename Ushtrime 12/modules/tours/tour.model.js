// title
// decsripton
// location
// country
// city
// price
// averageReating
// image
// updatedAt
// createdAt
import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, reuired: true },
    averageReating: { type: Number, default: 0 },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
