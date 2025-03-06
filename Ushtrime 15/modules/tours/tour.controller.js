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
    const tours = await Tour.find()
      .populate("createdBy", "firstName lastName")
      .populate("reviews.user", "firstName lastName");
    res.status(200).json(tours);
  } catch (error) {
    console.log(error, "errorrr");
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const tour = await Tour.findById(tourId)
      .populate("createdBy", "firstName lastName")
      .populate("reviews.user", "firstName lastName");
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
export const updateTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { title, description, location, country, city, price } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Update only provided fields
    if (title) tour.title = title;
    if (description) tour.description = description;
    if (location) tour.location = location;
    if (country) tour.country = country;
    if (city) tour.city = city;
    if (price) tour.price = price;
    if (image) tour.image = image;

    await tour.save();

    res.status(200).json({ message: "Tour updated successfully", tour });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
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

export const addReview = async (req, res) => {
  try {
    const tourId = req.params.tourId;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const { rating, comment, user } = req.body;

    const existingReview = tour.reviews.find(
      (rev) => rev.user.toString() === user
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already revied this tour" });
    }
    const newReview = { user, rating, comment };
    tour.reviews.push(newReview);

    const totalRating = tour.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    tour.averageReating = totalRating / tour.reviews.length;

    tour.save();
    res.status(201).json({ message: "Review Added successfully", tour });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
