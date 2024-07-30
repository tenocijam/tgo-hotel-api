import "dotenv/config"
import mongoose from "mongoose";
import * as fs from "node:fs/promises";
import { Rooms, Types, Views, Amenities, Bookings } from "./models/models.js";

const conn = mongoose.connect(process.env.MONGODB_URL);

// delete collection if it exists
conn.then(async (connection) => {
	console.log("Connected to MongoDB");
	try {
		const collections = ["rooms", "types", "views", "amenities"];

		// List all collections in the database
		const dBCollections = await connection.connection.db.listCollections().toArray();

		collections.forEach(async (collectionName) => {
			const collectionExists = dBCollections.some((collection) => collection.name === collectionName);
			if (collectionExists) {
				// Drop the collection if it exists
				await connection.connection.db.dropCollection(collectionName);
				console.log(`Collection ${collectionName} deleted.`);
			} else {
				console.log(`Collection ${collectionName} does not exist.`);
			}
		});
		
		// create collections and insert data
		await run();
		// disconnect the connection with MongoDB
		connection.disconnect();
		
		console.log("Disconnected from MongoDB");
	} catch (error) {
		console.error("Error checking or deleting collection:", error);
	}
}).catch((error) => {
	console.error("Error connecting to the database:", error);
});

// make collections and insert data
async function run() {
	try {
		// inserting types
		let data = await fs.readFile("./data/types.json", "utf8");
		let types = JSON.parse(data);
		await Types.insertMany(types);
		console.log("Types inserted");

		// inserting amenities
		data = await fs.readFile("./data/amenities.json", "utf8");
		let amenities = JSON.parse(data);
		await Amenities.insertMany(amenities);
		console.log("Amenities inserted");

		// inserting views
		data = await fs.readFile("./data/views.json", "utf8");
		let views = JSON.parse(data);
		await Views.insertMany(views);
		console.log("Views inserted");

		// inserting sample bookings
		data = await fs.readFile("./data/bookings.json", "utf8");
		let bookings = JSON.parse(data);
		await Bookings.insertMany(bookings);
		console.log("Bookings inserted");

		// creating rooms
		data = await fs.readFile("./data/rooms.json", "utf-8");
		let rooms = JSON.parse(data);
		await saveRooms(rooms);
		console.log("Rooms inserted");

		console.log("All data inserted");
		
		
	} catch (err) {
		console.error("Error inserting documents:", err);
	}
}

// save room to rooms collection
async function saveRooms(rooms) {

	for (const room of rooms) {
		try {
			const typeId = await Types.findOne({ name: room.type });
			const viewId = await Views.findOne({ name: room.view });
			const amenities = await Amenities.find({
				name: { $in: room.amenities },
			});
			const amenitiesIds = amenities.map((amenity) => amenity._id);

			await new Rooms({
				name: room.name,
				description: room.description,
				size: room.size,
				images: room.images,
				type: typeId,
				view: viewId,
				rating: room.rating,
				amenities: amenitiesIds,
				maxGuests: room.maxGuests,
				costPerNight: room.costPerNight,
			}).save();
	
			console.log(`Saved ${room.name} to DB.`);
		} catch (e) {
			console.error(e.message);
		}
	}
}




async function saveToDb(room) {
	try {
		const typeId = await Types.findOne({ name: room.type });
		const viewId = await Views.findOne({ name: room.view });
		const amenities = await Amenities.find({
			name: { $in: room.amenities },
		});
		const amenitiesIds = amenities.map((amenity) => amenity._id);

		// room.amenities.forEach((inputAmenity) => {
		// 	amenities.forEach((amenity) => {
		// 		if (inputAmenity === amenity) {
		// 			amenitiesIds.push(amenity._id);
		// 		}
		// 	});
		// });

		await new Rooms({
			name: room.name,
			description: room.description,
			size: room.size,
			images: room.images,
			type: typeId,
			view: viewId,
			amenities: amenitiesIds,
			maxGuests: room.maxGuests,
			costPerNight: room.costPerNight,
		}).save();

		console.log(`Saved ${room.name} to DB.`);
	} catch (e) {
		console.error(e.message);
	}
}

async function queryDocuments() {
	try {
		const rooms = await Rooms.find().populate("type").populate("view").populate("amenities");

		rooms.forEach((room) => {
			const amenities = room.amenities.map((amenity) => amenity.name);
			// console.log("===============");
			// console.log(room);
			// console.log("===============");
			console.log(`${room.name}\n${room.description}\n${room.type.name}\n${room.view.name}\n${amenities}`);
			console.log("-------------------");
		});
	} catch (error) {
		console.error(error.message);
	}
}

async function readFromFile() {
	fs.readFile("./data/rooms.json", "utf8", (err, data) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}

		try {
			const jsonArray = JSON.parse(data);

			jsonArray.forEach(async (room, index) => {
				// console.log(`Room ${index + 1}:`, room);

				await saveToDb(room);
			});
			console.log("Rooms inserted");
		} catch (parseError) {
			console.error("Error parsing JSON data:", parseError);
		}
	});
}

// unwanted codes:
// run()
// creating rooms
// readFromFile();
// queryDocuments().catch((err) => console.error(err));
// query documents
// await rooms.forEach(async (room) => {
// 	await saveToDb(room);
// });