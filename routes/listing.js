const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const {isLogedIn, isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });


const listingController=require("../controllers/listings.js");

//index route
router.get("/" ,wrapAsync(listingController.index));

//new route
router.get("/new" , isLogedIn, listingController.renderNewForm);

//create route
router.post("/create" ,
    isLogedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLogedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,wrapAsync( listingController.updateListing)
    )
    .delete(isLogedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

//show route
// router.get("/:id" ,wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit" ,isLogedIn,isOwner, wrapAsync(listingController.renderEditform));

//update route
// router.put("/:id",isLogedIn,isOwner,validateListing,wrapAsync( listingController.updateListing));

//delete route
// router.delete("/:id" ,isLogedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports=router;