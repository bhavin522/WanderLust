const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAuthor } = require("../middleware");
const { validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const Listing = require("../models/listing");

// Index Route - Show all listings // Create Route - Create a new listing
router
  .route("/")
  .get(wrapAsync(async (req, res) => {
    // Extract filter parameters
    const { location, country, minPrice, maxPrice } = req.query;

    // Build filter object
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }

    if (country) {
      filter.country = country;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Fetch listings with filters
    const allListing = await Listing.find(filter);
    res.render("listings/index.ejs", { allListing });
  }))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route - Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    // Pass req object to template
    res.render("listings/show.ejs", { listing, req });
  }))
  .put(
    isLoggedIn,
    isAuthor,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(listingController.destroyListing));

// Edit Route - Form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
