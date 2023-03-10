const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

// Body Parser Middleware
// allows to handle raw json
app.use(express.json());
// allows to handle form submissions
app.use(express.urlencoded({ extended: true }));

//Static folder
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/notes', require('./routes/api'));

//link to Home page
app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/index.html'))
);

//link to Notes page
app.get('/notes', (req, res) =>
	res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
