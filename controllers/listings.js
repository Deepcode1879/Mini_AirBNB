const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAPBOX_PUBLIC_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listing/index.ejs",{listings});
};

module.exports.renderNewForm=(req,res)=>{
    return res.render("listing/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    
    const listing =await Listing.findById(id)
    .populate({
        path :"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");

    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs" , {listing});
};

module.exports.createListing=async (req,res)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url=req.file.path;
    let filename=req.file.filename;

    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;

    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditform=async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist!");
        return res.redirect("/listings");
    }

    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload" , "/upload/w_250,e_blur:200");


    res.render("listing/edit.ejs" , {listing,originalUrl});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let newListing=req.body.listing;
    let listing=await Listing.findByIdAndUpdate(id,newListing);

    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};