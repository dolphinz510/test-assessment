import express from 'express';
import apiRouter from './api/apiRouter';

// Set up the server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the port 
const port = 3010;

// Register the API router
app.use('/api', apiRouter);

// This matches all routes and all methods
app.use((req, res, next) => {
	res.status(404).send({
		status: 404,
		error: 'Page not found!'
	});
});

// Set up the server with the set port 
app.listen(port, () => console.log(`Server now listening on port ${port}`));
