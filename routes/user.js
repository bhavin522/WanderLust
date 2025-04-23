const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router
  .route("/signup")
  .get(userController.rendersignupForm)
  .post(userController.signup);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

// Favorites routes
router.get("/favorites", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view favorites");
    return res.redirect("/user/login");
  }

  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("users/favorites", { favorites: user.favorites });
  } catch (err) {
    req.flash("error", "Failed to load favorites");
    res.redirect("/listings");
  }
});

// Add to favorites
router.post("/favorites/:listingId", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to add favorites");
    return res.redirect("/user/login");
  }

  try {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    // Get the listing to include its title in the flash message
    const Listing = require("../models/listing");
    const listing = await Listing.findById(listingId);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Check if already in favorites
    if (user.favorites.includes(listingId)) {
      req.flash("error", `"${listing.title}" is already in your favorites`);
      return res.redirect(`/listings/${listingId}`);
    }

    user.favorites.push(listingId);
    await user.save();
    req.flash("success", `"${listing.title}" has been added to your favorites`);
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    req.flash("error", "Failed to add to favorites");
    res.redirect("/listings");
  }
});

// Remove from favorites
router.delete("/favorites/:listingId", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/user/login");
  }

  try {
    const { listingId } = req.params;

    // Get the listing to include its title in the flash message
    const Listing = require("../models/listing");
    const listing = await Listing.findById(listingId);

    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: listingId } });

    if (listing) {
      req.flash("success", `"${listing.title}" has been removed from your favorites`);
    } else {
      req.flash("success", "Listing has been removed from your favorites");
    }

    res.redirect("/user/favorites");
  } catch (err) {
    req.flash("error", "Failed to remove from favorites");
    res.redirect("/user/favorites");
  }
});

// User profile routes
router.get("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to view your profile");
    return res.redirect("/user/login");
  }

  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("users/profile", { favorites: user.favorites });
  } catch (err) {
    req.flash("error", "Failed to load profile");
    res.redirect("/listings");
  }
});

router.get("/profile/edit", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to edit your profile");
    return res.redirect("/user/login");
  }

  res.render("users/profile-edit");
});

router.put("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to update your profile");
    return res.redirect("/user/login");
  }

  try {
    const { bio, phoneNumber, location, avatar } = req.body;

    // Create update object with form data
    const updateData = {
      bio,
      phoneNumber,
      location,
      avatar: avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    };

    // Handle preferences
    updateData.preferences = {
      currency: req.body.preferences.currency || "INR",
      language: req.body.preferences.language || "English",
      notifications: req.body.preferences.notifications === 'on' || false
    };

    // Update user in database
    await User.findByIdAndUpdate(req.user._id, updateData);

    req.flash("success", "Profile updated successfully");
    res.redirect("/user/profile");
  } catch (err) {
    req.flash("error", "Failed to update profile");
    res.redirect("/user/profile/edit");
  }
});

module.exports = router;
