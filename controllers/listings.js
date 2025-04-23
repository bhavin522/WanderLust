const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    try {
        const listingData = req.body.listing;

        // Handle image URL 
        if (listingData.image && typeof listingData.image === 'string') {
            // If image is provided as a string, convert to object format
            listingData.image = { url: listingData.image };
        } else if (!listingData.image || !listingData.image.url) {
            // If no image or empty url, set default
            listingData.image = {
                url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww"
            };
        }

        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        await newListing.save();

        req.flash("success", `"${newListing.title}" has been created successfully!`);
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "Error creating listing: " + err.message);
        res.redirect("/listings/new");
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listingData = req.body.listing;

        // Handle image URL
        if (listingData.image && typeof listingData.image === 'string') {
            // If image is provided as a string, convert to object format
            listingData.image = { url: listingData.image };
        } else if (!listingData.image || !listingData.image.url) {
            // If no image or empty url, set default
            listingData.image = {
                url: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww"
            };
        }

        let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        req.flash("success", `"${listing.title}" has been updated successfully!`);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Error updating listing: " + err.message);
        res.redirect(`/listings/${req.params.id}/edit`);
    }
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing) {
        req.flash("success", `"${deletedListing.title}" has been deleted successfully`);
    } else {
        req.flash("success", "Listing has been deleted successfully");
    }
    res.redirect("/listings");
};