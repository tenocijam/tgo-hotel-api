import "dotenv/config"
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Rooms, Types, Views, Amenities, Bookings } from "./models/models.js";

const conn = mongoose.connect(process.env.MONGODB_URL);

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
	res.send("TGO Hotel API v1.0");
});

app.get("/rooms", async (req, res) => {
	try {
		const rooms = await Rooms.find().populate("type").populate("view").populate("amenities");

		res.status(200).json(rooms);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: error.message });
	}
});

app.get("/rooms/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const room = await Rooms.findById(id)
			.populate("type")
			.populate("view")
			.populate("amenities");

		if (!room) {
			return res.status(404).json({messsage: `Room not found with id: ${id}`});
		}

		res.status(200).json(room);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Add new room
app.post("/rooms", async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;

		const typeId = await Types.findOne({ name: data.type });
		const viewId = await Views.findOne({ name: data.view });
		const amenities = await Amenities.find({
			name: { $in: data.amenities },
		});
		const amenitiesIds = amenities.map((amenity) => amenity._id);

		const newDetails = {
			name: data.name,
			description: data.description,
			size: data.size,
			images: data.images,
			rating: data.rating,
			maxGuests: data.maxGuests,
			costPerNight: data.costPerNight,
			type: typeId,
			view: viewId,
			amenities: amenitiesIds,
		};
		console.log(newDetails);

		const room = await Rooms.create(newDetails);

		res.status(200).send("Room added successfully");
		// res.status(200).json(newDetails);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update room
app.put("/rooms/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;

		const typeId = await Types.findOne({ name: data.type });
		const viewId = await Views.findOne({ name: data.view });
		const amenities = await Amenities.find({
			name: { $in: data.amenities },
		});
		const amenitiesIds = amenities.map((amenity) => amenity._id);

		const newDetails = {
			name: data.name,
			description: data.description,
			size: data.size,
			images: data.images,
			rating: data.rating,
			maxGuests: data.maxGuests,
			costPerNight: data.costPerNight,
			type: typeId,
			view: viewId,
			amenities: amenitiesIds,
		};
		console.log(newDetails);

		const room = await Rooms.findByIdAndUpdate(id, newDetails);

		if (!room) {
			return res.status(404).json({ message: `No room with ID: ${id}` });
		}

		res.status(200).send("Room updated successfully");
		// res.status(200).json(newDetails);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete room
app.delete("/rooms/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const room = await Rooms.findByIdAndDelete(id);

		if (!room) {
			return res.status(404).json({ message: `Room not found with id: ${id}` });
		}

		res.status(200).json({ message: `Room with id ${id} deleted successfully` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get("/amenities", async (req, res) => {
	try {
		const amenities = await Amenities.find();

		res.status(200).json(amenities);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get("/views", async (req, res) => {
	try {
		const views = await Views.find();

		res.status(200).json(views);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get("/bookings", async (req, res) => {
	try {
		const bookings = await Bookings.find();

		res.status(200).json(bookings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.post("/bookings", async (req, res) => {
	try {
		const data = req.body;

		await Bookings.create(data);

		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

conn.then(() => {
	console.log("Connected to MongoDB");

	app.listen(PORT, () => {
		console.log(`TGO Hotel API is running on port ${PORT}`);
	});
});
