const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db/connection');
const EventRouter = require('./Router/event');

const app = express();
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded(
    { extended: true }
))
dotenv.config({ path: './config.env' })

const port = process.env.PORT || 5000;

connectToDatabase()
    .then(() => {
        // Set up routes

        // Mount the role routes
        app.get("/", async (req, res) => {
            res.json("Congratulations!! Beackend server made successfully")
        })
        app.use('/api/v3/app/events', EventRouter)
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
