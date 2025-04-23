const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    listing.reviews.pull(reviewId);
    await listing.save();

    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}
