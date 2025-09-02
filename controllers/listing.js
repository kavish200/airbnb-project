const Listing = require("../models/listing");
const geocoder = require("../public/js/map");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    try {
        const location = req.body.listing.location;
        const response = await geocoder.geocode(location);
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url: req.file.path, filename: req.file.filename };
        
        if (response.length > 0) {
            // Case 1: Geocoding was successful
            newListing.geometry = {
                type: "Point",
                coordinates: [response[0].longitude, response[0].latitude]
            };
            console.log('Successfully geocoded!');
            console.log('Coordinates:', newListing.geometry.coordinates);
        } else {
            // Case 2: Geocoding failed, so set a default or null value
            // This prevents the validation error
            newListing.geometry = {
                type: "Point",
                coordinates: [0, 0] // A default, non-functional set of coordinates
            };
            console.log('Geocoding failed for the address:', location);
        }

        await newListing.save();

        req.flash("success", "New listing Created!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", "Failed to create listing: " + err.message);
        res.redirect("back");
    }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        // Add the geocoding logic here
        const response = await geocoder.geocode(req.body.listing.location);

        if (response.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: [response[0].longitude, response[0].latitude]
            };
            await listing.save();
        }

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Failed to update listing: " + err.message);
        res.redirect("back");
    }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
