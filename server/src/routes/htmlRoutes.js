import path from 'node:path'; // this imports the path module from Node so we can work with file and directory paths
import { fileURLToPath } from 'node:url'; // this  imports fileURLToPath function from the url module in Node.js which is used to convert a file: URL to a file system path
import { Router } from 'express';// imports the class Router(a mini Express app to handle specific routes) from the express package.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This line calculates the directory name of the current file using path.dirname(), which gives you the folder path in which the current file resides. 
const router = Router(); //creates a new Router() function, can be used to define routes and middleware


// TODO: Define route to serve index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../../../client/public/index.html'));
  });

export default router; // this exports the router instance so it can be used elsewhere. 
