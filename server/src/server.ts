import dotenv from 'dotenv'; // - this allows the environment to be loaded from the .env for the API key
import express from 'express'; // - imports express to simplify routes, requests and middleware
dotenv.config(); // -this is what is actually reading the .env file

// Import the routes
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';
   

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static("../client/dist")); //uses express' static middleware to server static files from the ./client/dist

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); // parses incoming requests with JSON and makes data available in req.body
app.use(express.urlencoded({ extended: true })); // parses incoming requests with URL-encoded payloads and makes the parsed data availble in req.body

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);  // Registers the weather route under /api/weather
app.use('/', htmlRoutes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`)); // app.listen starts the express server, and it listens to request on the port identifed
