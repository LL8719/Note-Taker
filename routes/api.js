const express = require('express');
const router = require('express').Router();
const fs = require('fs');

const uuid = require('uuid');
const uuidv4 = uuid.v4().substr(0, 2);

// get request for current api notes
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
	console.info(`${req.method} request received to add a note`);

	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all the required properties are present
	if (title && text) {
		// Variable for the object we will save
		const newNote = {
			title,
			text,
			id: uuidv4,
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
				fs.writeFile(
					'./db/db.json',
					JSON.stringify(parsedNotes, null, 4),
					(writeErr) =>
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

// Delete Note
router.delete('/:id', (req, res) => {
	console.info(`${req.method} request received to delete a note`);

	fs.readFile('./db/db.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
		} else {
			const parsedNotes = JSON.parse(data);

			res.json(parsedNotes);
			// convert to integer
			const id = parseInt(req.params.id);

			const deleteNote = parsedNotes.find((el) => el.id === id);
			const noteIndex = parsedNotes.indexOf(deleteNote);

			parsedNotes.splice(noteIndex, 1);

			fs.writeFile(
				'./db/db.json',
				JSON.stringify(parsedNotes, null, 4),
				(writeErr) =>
					writeErr
						? console.error(writeErr)
						: console.info('Successfully updated notes!')
			);
		}
	});
});

module.exports = router;
