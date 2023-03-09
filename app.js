const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));

//Static folder
app.use(express.static(path.join(__dirname, '/public')));

//link to Home page
app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/index.html'))
);

//link to Notes page
app.get('/notes', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// get request for current notes
app.get('/api/notes', (req, res) => {
	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			const parsedNotes = JSON.parse(data);
			res.json(parsedNotes);
		}
	});
});

// Post request to add note
app.post('/api/notes', (req, res) => {
	console.info(`${req.method} request received to add a note`);

	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all the required properties are present
	if (title && text) {
		// Variable for the object we will save
		const newNote = {
			title,
			text,
		};
		// Obtain existing notes
		fs.readFile('./db/db.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
			} else {
				// Convert string into JSON object
				const parsedNotes = JSON.parse(data);

				// Add a new note
				parsedNotes.push(newNote);

				// Write updated notes back to the file
				fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (writeErr) =>
					writeErr
						? console.error(writeErr)
						: console.info('Successfully updated notes!')
				);
			}
		});
		const response = {
			status: 'success',
			body: newNote,
		};

		console.log(response);
		res.status(201).json(response);
	} else {
		res.status(500).json('Error in posting Note');
	}
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
