const ExpressError = require('./utils/ExpressError');
const Listing = require('./models/listing');
const { reviewSchema, listingSchema } = require('./schema');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirecturl = req.originalUrl;
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be Logged in!');
    res.redirect('/user/login');
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirecturl) {
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        if (!listing.owner._id.equals(res.locals.currentUser._id)) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(new ExpressError(500, 'Something went wrong'));
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.message);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    try {
        const reviewDoc = await Review.findById(reviewId); // Changed from review to Review and id to reviewId

        if (!reviewDoc) {
            req.flash('error', 'Review not found');
            return res.redirect(`/listings/${id}`);
        }

        if (!reviewDoc.author.equals(res.locals.currentUser._id)) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(new ExpressError(500, 'Something went wrong'));
    }
};
