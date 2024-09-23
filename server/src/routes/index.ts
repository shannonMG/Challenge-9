import { Router } from 'express'; // imports the class Router(a mini Express app to handle specific routes) from the express package.
const router = Router(); //creates a new Router() function, can be used to define routes and middleware

import apiRoutes from './api/index.js'; //imports the routes defined in ./api/index.js file. (used to handle API requests)
import htmlRoutes from './htmlRoutes.js'; //imports the routes defined in ./htmlRoutes.js file. 


router.use('/api', apiRoutes); //this tells the router to use the apiRoutes for any requests that start with /api.
router.use('/', htmlRoutes); //this tells the router that anything that doesn't start with /api should be handled by htmlRoutes


export default router; // this exports the router instance so it can be used elsewhere. 
