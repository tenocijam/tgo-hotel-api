import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roomSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter room name"],
		},
		description: String,
		size: Number,
		images: [String],
		type: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "types",
		},
		amenities: {
			type: [mongoose.SchemaTypes.ObjectId],
			ref: "amenities",
		},
		view: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "views",
		},
		rating: {
			type: Number,
		},
		maxGuests: {
			type: Number,
			min: 1,
			max: 10,
		},
		costPerNight: {
			type: Number,
			min: 100,
		},
	},
	{ timestamps: true }
);

const typeSchema = new Schema({
	name: String,
});

const viewSchema = new Schema({
	name: String,
});

const amenitySchema = new Schema({
	name: String,
});

const bookingSchema = new Schema(
	{
		username: String,
		email: String,
		paymentMethod: String,
		checkInDate: Date,
		checkOutDate: Date,
		rooms: [
			{
				roomId: mongoose.SchemaTypes.ObjectId,
				adults: Number,
				children: Number,
			},
		],
		totalCost: Number
	},
	{ timestamps: true }
);

// Models
const Rooms = mongoose.model("rooms", roomSchema);
const Types = mongoose.model("types", typeSchema);
const Amenities = mongoose.model("amenities", amenitySchema);
const Views = mongoose.model("views", viewSchema);
const Bookings = mongoose.model("bookings", bookingSchema);

export { Rooms, Types, Views, Amenities, Bookings };
