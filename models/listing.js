const mongoose=require("mongoose");
const Review = require("./review");
const Schema= mongoose.Schema;

const listingSchema =new Schema({
    title : {
        type :String,
        required : true,
    },
    description : {
        type :String,
        
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            set: (v) =>
                (!v || v.trim() === "")
                    ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                    : v
        }
    },
    price : {
        type : Number,
        default: 10,
        set: (v) => (!v || v === "") ? 10 : v,
    },
    location : {
        type :String,
        
    },
    country : {
        type :String,
        
    },
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner  :{
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }   
});

const listing=mongoose.model("Listing",listingSchema);
module.exports = listing;