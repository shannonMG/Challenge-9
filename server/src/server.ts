import dotenv from 'dotenv'; // - this allows the environment to be loaded from the .env for the API key
import path from 'path'; // imports parth module
import { fileURLToPath } from 'url'; 
import express from 'express'; // - imports express to simplify routes, requests and middleware
dotenv.config(); // -this is what is actually reading the .env file

// Import the routes
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);  // Get current file path
const __dirname = path.dirname(__filename);   

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, "../client/dist"))); //uses express' static middleware to server static files from the ./client/dist

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json()); // parses incoming requests with JSON and makes data available in req.body
app.use(express.urlencoded({ extended: true })); // parses incoming requests with URL-encoded payloads and makes the parsed data availble in req.body

// TODO: Implement middleware to connect the routes
app.use(routes); // using the app.use method to mount middleware to our app, in this case the routes, which reffers to the routes we imported from index.js 

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`)); // app.listen starts the express server, and it listens to request on the port identifed
