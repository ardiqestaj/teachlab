import Tour from "./tour.model.js";

export const createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      country,
      city,
      price,
      averageReating,
      image,
    } = req.body;
    const tour = new Tour({
      title: title,
      description,
      location,
      country,
      city,
      price,
      averageReating,
      image,
    });
    await tour.save();
    res.status(201).json({ message: "Trou created", tour });
  } catch (error) {
    res.status(400).json({ message: "Error creating Tour", error: error });
  }
};
