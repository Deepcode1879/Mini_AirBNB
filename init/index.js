const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("db is working");
    return initDB();
     
})
.then(()=>{
    return mongoose.connection.close();
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mini_Airbnb');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner :"6aa7f0362247ae8b5edb56b7"}));
    await Listing.insertMany(initData.data);
}

initDB();
