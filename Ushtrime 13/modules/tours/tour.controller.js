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
      createdBy,
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
      createdBy,
    });
    await tour.save();
    res.status(201).json({ message: "Trou created", tour });
  } catch (error) {
    res.status(400).json({ message: "Error creating Tour", error: error });
  }
};

export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate("createdBy", "firstName lastName");
    res.status(200).json(tours);
  } catch (error) {
    console.log(error, "errorrr");
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const tour = await Tour.findById(tourId).populate(
      "createdBy",
      "firstName lastName"
    );
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const tour = await Tour.findByIdAndDelete(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour nof found" });
    }
    res.status(200).json({ message: "Tour Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
