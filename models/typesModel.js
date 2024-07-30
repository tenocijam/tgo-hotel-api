import mongoose from "mongoose";

const typeSchema = new mongoose.Schema({
    name: String,
    rooms: [mongoose.SchemaTypes.ObjectId]
});

export default mongoose.model("rooms.types", typeSchema)