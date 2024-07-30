import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: String,
    description: String,
    size: Number,
    type: String,
    viewType: String,
    maxGuests: Number,
    amenities: String,
    costPerNight: Number
});

export default mongoose.model("Rooms", roomSchema)