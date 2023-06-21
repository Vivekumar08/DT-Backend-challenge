const express = require("express");
const connectToDatabase = require("../db/connection");
const upload = require("../utils/multer");
const { ObjectId } = require("mongodb");
const { generateId, validateTimestamp } = require("../utils/basicFunctions");
const EventRouter = express.Router();

EventRouter.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
        const db = await connectToDatabase();
        const eventCollection = db.collection('events');
        const imageCollection = db.collection('images');

        // Validate the schedule
        if (validateTimestamp(schedule)) return res.status(400).json({ error: "Not valid schedule !!" })

        const event = {
            name,
            uid: generateId(),
            imageId: req.file.originalname, // Reference to the image document- 'name'
            tagline,
            schedule,
            description,
            moderator,
            category,
            sub_category,
            rigor_rank,
            created_at: new Date(),
            updated_at: new Date()
        };
        // Insert the event document into the events collection
        const eventResult = await eventCollection.insertOne(event);
        const imgData = req.file.buffer
        const image = {
            imgId: eventResult.insertedId,
            name: req.file.originalname,
            data: imgData,
            mimetype: req.file.mimetype
        };
        // Insert the image document into the images collection
        await imageCollection.insertOne(image);
        // Return the ID of the created event
        res.json({ eventId: eventResult.insertedId });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
})

EventRouter.get('/', async (req, res) => {
    try {
        if (req.query.id) {
            const id = req.query.id
            const db = await connectToDatabase();
            const eventCollection = db.collection('events');

            const event = await eventCollection.findOne({ _id: new ObjectId(id) })
            res.status(200).json(event)
        } else {
            const type = req.query.type || 'latest'
            const page = req.query.page || 1
            const limit = req.query.limit || 5

            const db = await connectToDatabase();
            const eventCollection = db.collection('events');
            const totalDocuments = await eventCollection.countDocuments();

            // Calculate total number of pages
            const totalPages = Math.ceil(totalDocuments / limit);

            if (type === 'latest') {
                const events = await eventCollection.find({})
                    .sort({ created_at: 1 }) // Sort by ascending created_at
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();

                const response = {
                    status: true,
                    content: {
                        meta: {
                            total: totalDocuments,
                            pages: totalPages,
                            page: page,
                            type: type
                        },
                        data: events
                    }
                };
                res.status(200).json(response);
            } else {

                const events = await eventCollection.find({})
                    .sort({ created_at: -1 }) // Sort by ascending created_at
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .toArray();

                const response = {
                    status: true,
                    content: {
                        meta: {
                            total: totalDocuments,
                            pages: totalPages,
                            page: page,
                            type: type
                        },
                        data: events
                    }
                };
                res.status(200).json(response);
            }
        }
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
})

EventRouter.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const eventId = req.params.id
        const { name, tagline, schedule, description, moderator, category, sub_category, rigor_rank } = req.body;
        const db = await connectToDatabase();
        const eventCollection = db.collection('events');
        const imageCollection = db.collection('images');

        if (validateTimestamp(schedule)) return res.status(400).json({ error: "Not valid schedule !!" })

        // Check if the event exists
        const existingEvent = await eventCollection.findOne({ _id: new ObjectId(eventId) });
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const event = {
            name,
            imageId: req.file.originalname, // Reference to the image document- 'name'
            tagline,
            schedule,
            description,
            moderator,
            category,
            sub_category,
            rigor_rank,
            updated_at: new Date()
        };

        const imgData = req.file.buffer

        const image = {
            name: req.file.originalname,
            data: imgData,
            mimetype: req.file.mimetype
        };
        await imageCollection.findOneAndUpdate({ imgId: new ObjectId(eventId) }, { $set: image })
        await eventCollection.findOneAndUpdate({ _id: new ObjectId(eventId) }, { $set: event })
        res.status(200).json({ status: true, data: { message: `${eventId}, This event is successfully edited !!` } })
    } catch (error) {
        console.error('Error editing event:', error);
        res.status(500).json({ error: 'An error occurred while editing the event' });

    }
})

// Delete an events by its id
EventRouter.delete('/:id', async (req, res) => {
    try {
        const eventId = req.params.id
        const db = await connectToDatabase();
        const eventCollection = db.collection('events');
        const imageCollection = db.collection('images');

        // Check if the event exists
        const existingEvent = await eventCollection.findOne({ _id: new ObjectId(eventId) });
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await eventCollection.findOneAndDelete({ _id: new ObjectId(eventId) })
        await imageCollection.findOneAndDelete({ imgId: new ObjectId(eventId) })

        res.status(200).json({ status: true, data: { message: `${eventId}, This is deleted successfully !! ` } });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'An error occurred while deleting the event' });
    }
})

// fetch image data by image id
EventRouter.get('/images/:id', async (req, res) => {
    try {
        const imageId = req.params.id;

        // Create a MongoDB client and connect to the database
        const db = await connectToDatabase();
        const imageCollection = db.collection('images');

        // Retrieve the image from the images collection
        const image = await imageCollection.findOne({ imgId: new ObjectId(imageId) });
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Convert the Binary data to a Buffer
        const imageBuffer = Buffer.from(image.data.buffer);

        // Set the appropriate response headers for the image
        res.set('Content-Type', image.mimetype); // Adjust the Content-Type according to your image format
        res.set('Content-Length', imageBuffer.length);

        // Send the image data as the response
        res.send(image.data.buffer);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'An error occurred while fetching the image' });
    }
})
module.exports = EventRouter;